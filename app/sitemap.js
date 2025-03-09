import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/Blogmodel";

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    await ConnectDB();
    const blogs = await BlogModel.find().select("slug date").lean();

    // Generate dynamic URLs for each blog
    const blogSitemap = blogs.map((blog) => ({
      url: `${siteUrl}/${blog.slug}`,
      lastModified: new Date(blog.date).toISOString(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [
      {
        url: `${siteUrl}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "yearly",
        priority: 1,
      },
      ...blogSitemap,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
