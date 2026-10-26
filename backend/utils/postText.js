const { sanitizeNbsp } = require('./sanitizeHtml');

// Posts from the form store template fields in content[0]; older posts
// may store an object or plain HTML instead. Keep content intact for clients
// that render blocks, and expose consistent text fields for landing pages.
function normalizePostText(post) {
    const content = post.content;
    const fields = Array.isArray(content) ? content[0] : content;
    const data = fields && typeof fields === 'object' ? fields : {};
    const firstText = (...values) => values.find(value => typeof value === 'string' && value.trim()) || '';

    // An explicitly empty excerpt is intentional; do not revive stale content.
    const excerpt = typeof post.excerpt === 'string' ? post.excerpt : firstText(data.excerpt, data.summary);
    const templateFields = {
        artikel: 'body_content',
        event: 'event_description',
        lowongan: 'requirements',
        pengumuman: 'alert_message',
        template: 'short_description'
    };
    const template = String(post.template_type || post.category || '').toLowerCase();
    const description = template === 'custom' ? firstText(post.description) : firstText(
        data[templateFields[template]],
        data.description,
        data.body,
        data.main_content,
        data.body_content,
        data.event_description,
        data.short_description,
        post.description,
        typeof content === 'string' ? content : ''
    );

    return {
        ...post,
        excerpt: sanitizeNbsp(excerpt),
        summary: sanitizeNbsp(excerpt),
        description: sanitizeNbsp(description)
    };
}

module.exports = { normalizePostText };
