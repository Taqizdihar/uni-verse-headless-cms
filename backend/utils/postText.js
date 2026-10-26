const { sanitizeNbsp } = require('./sanitizeHtml');

// Posts from the form store template fields in content[0]; older posts
// may store an object, a post_*.data wrapper, or plain HTML instead.
// GIAT reads content[0].excerpt and content[0].body_content, so template posts
// must expose that shape as well as the top-level text aliases.
function normalizePostText(post) {
    let content = post.content;
    if (typeof content === 'string') {
        try { content = JSON.parse(content); } catch (_) { /* Legacy HTML. */ }
    }
    const fields = Array.isArray(content) ? content[0] : content;
    const wrappedPost = fields && typeof fields.type === 'string' && fields.type.startsWith('post_')
        && fields.data && typeof fields.data === 'object';
    const data = wrappedPost ? fields.data : (fields && typeof fields === 'object' ? fields : {});
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
    const template = String(post.template_type || post.category || (wrappedPost ? fields.type.slice(5) : '')).toLowerCase();
    // Dynamic blocks are rendered separately; never turn a hero or another
    // arbitrary block's description into a post description.
    const dynamicBlocks = Array.isArray(content) && content.some(block =>
        block && typeof block.type === 'string' && !block.type.startsWith('post_') && block.type !== 'template'
    );
    const custom = template === 'custom' || dynamicBlocks;
    const description = custom ? firstText(post.description) : firstText(
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

    const normalizedExcerpt = sanitizeNbsp(excerpt);
    const normalizedDescription = sanitizeNbsp(description);
    let normalizedContent = content;
    if (!custom) {
        const item = {
            ...data,
            ...(wrappedPost ? fields : {}),
            excerpt: normalizedExcerpt,
            body_content: normalizedDescription
        };
        normalizedContent = Array.isArray(content) ? [item, ...content.slice(1)] : [item];
    }

    return {
        ...post,
        content: normalizedContent,
        excerpt: normalizedExcerpt,
        summary: normalizedExcerpt,
        description: normalizedDescription
    };
}

module.exports = { normalizePostText };
