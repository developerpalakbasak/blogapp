import { ConnectDB } from "@/lib/config/db"
import BlogModel from "@/lib/models/Blogmodel";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/config/cloudinary";
import generateUniqueSlug from "@/Components/generateUniqueSlug";




const LoadDB = async () => {

    await ConnectDB();
}

LoadDB();




// API Endpoint to get blog
export async function GET(req) {
    // console.log("GET TO /blogs")


    try {
      const blogSlug = req.nextUrl.searchParams.get("slug");
      // console.log(blogSlug);

      if (blogSlug) {
          const blog = await BlogModel.findOne({ slug: blogSlug });

          if (!blog) {
              return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
          }

          return NextResponse.json({ success: true, blog }, { status: 200 });
      } else {
          const blogs = await BlogModel.find({});
          return NextResponse.json({ success: true, count: blogs.length, blogs }, { status: 200 });
      }
  } catch (error) {
      console.error(error);
      return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }

}




export async function POST(req) {
  const formData = await req.formData();

  try {
    // Extract the image from formData
    const image = formData.get('image');
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);

    // Generate a unique slug for the blog
    const title = formData.get("title");
    const slug = await generateUniqueSlug(title);


    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(`data:${image.type};base64,${buffer.toString('base64')}`, {
      folder: "blog_images", // Optional: Organize images in a folder
    });

    
    // Prepare blog data with Cloudinary URL
    const blogData = {
      title,
      slug,
      description: formData.get("description"),
      category: formData.get("category"),
      author: formData.get("author"),
      image: uploadResult.secure_url, // Cloudinary URL
      authorImg: formData.get("authorImg"),
    };

    // Save blog data to the database
    await BlogModel.create(blogData);
    console.log("Blog Saved");

    return NextResponse.json({ success: true, msg: "Blog Added", blog: blogData }, { status: 201 });
  } catch (error) {
    console.error("Error uploading image or saving blog:", error);
    return NextResponse.json({ success: false, msg: "Failed to add blog", error: error.message }, { status: 500 });
  }
}





// API Endpoint to delete blog
export async function DELETE(req) {
  const id = req.nextUrl.searchParams.get("id");

  try {
    // Find the blog in the database
    const blog = await BlogModel.findById(id);
    // console.log(blog)
    if (!blog) {
      return NextResponse.json({ success: false, msg: "Blog Not Found" }, { status: 404 });
    }


    // Extract the public ID from the image URL (Cloudinary format includes it)
    const imageUrl = blog.image;
    const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0]; // Extract public ID from URL

    console.log(imageUrl)
    console.log(publicId)

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(`blog_images/${publicId}`);

    // Delete the blog from the database
    await BlogModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true, msg: "Blog Deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ success: false, msg: "Failed to delete blog", error: error.message }, { status: 500 });
  }
}