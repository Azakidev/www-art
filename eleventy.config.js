import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { minify } from "terser";
import YAML from "yaml";
import { format } from "date-fns";

export default async function(eleventyConfig) {
    // Folders
    eleventyConfig.setInputDirectory("./pages/");

    // Resources
    eleventyConfig.addPassthroughCopy("./media/");
    eleventyConfig.addPassthroughCopy("./robots.txt");
    eleventyConfig.addPassthroughCopy("./pages/_data/images.json");

    // Watch
    eleventyConfig.addWatchTarget("./_includes/**/*");

    // Plugins
    eleventyConfig.addPlugin(feedPlugin, {
        type: "atom",
        outputPath: "/feed.xml",
        collection: {
            name: "musings", // iterate over `collections.posts`
            limit: 10,     // 0 means no limit
        },
        metadata: {
            language: "en",
            title: "FatDawlf's musings",
            subtitle: "A collection of thoughts, rambles, and general yapping.",
            base: "https://fatdawlf.art/",
            author: {
                name: "FatDawlf",
            }
        }
    });

    // Filters
    eleventyConfig.addFilter("jsmin", async function(code) {
        try {
            const minified = await minify(code);
            return minified.code;
        } catch (err) {
            console.error("Terser error: ", err);
            // Fail gracefully.
            return code;
        }
    });

    eleventyConfig.setFrontMatterParsingOptions({
        excerpt: true,
        excerpt_separator: "<!-- excerpt -->",
    });

    eleventyConfig.addFilter("head", (arr, num) => {
        return num ? arr.slice(0, num) : arr;
    });

    eleventyConfig.addFilter("headafter", (arr, num) => {
        return num ? arr.slice(num) : arr;
    });

    eleventyConfig.addFilter('date', function(date, dateFormat) {
        return format(date, dateFormat)
    });

    eleventyConfig.addFilter("firstWord", (str) => {
        return str.split(" ")[0]
    });

    eleventyConfig.addFilter("postDate", (dateObj) => {
        return dateObj.toLocaleString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    });
    
    // Setup YAML data
    eleventyConfig.addDataExtension("yaml", (contents) => YAML.parse(contents));
};
