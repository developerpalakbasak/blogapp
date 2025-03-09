import axios from "axios";

export default async function sitemap() {

  try {

    const response = await axios.get("http://localhost:3000/api/blog");
    const { blogs } = response.data

    // Generate dynamic URLs for each blog
    const blogSitemap = blogs.map((blog) => ({
      url: `http://localhost:3000/blog/${blog.slug}`,
      lastModified: new Date(blog.date).toISOString(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [
      {
        url: 'http://localhost:3000/',
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
      },

      ...blogSitemap

    ];



  } catch (error) {
    console.log(error);

  }
}