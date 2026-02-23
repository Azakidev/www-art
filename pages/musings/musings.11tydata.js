export default {
    layout: "musings.njk",
    tags: "musings",
    eleventyComputed: {
        permalink: "/musings/{{ page.fileSlug | slugify }}/",
    }
}

