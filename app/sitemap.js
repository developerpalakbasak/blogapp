import axios from "axios";

export default async function sitemap() {

  try {

    const response = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`);
    const { blogs } = response.data

    // Generate dynamic URLs for each blog
    const blogSitemap = blogs.map((blog) => ({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${blog.slug}`,
      lastModified: new Date(blog.date).toISOString(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
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