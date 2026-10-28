const { sanitizeNbsp } = require('./sanitizeHtml');
const sanitizeHtml = require('sanitize-html');

function safeExcerptHtml(html) {
    return sanitizeNbsp(sanitizeHtml(html, {
        allowedTags: ['p', 'br', 'h1', 'h2', 'strong', 'b', 'em', 'i', 'u', 'ol', 'ul', 'li', 'a'],
        allowedAttributes: { a: ['href'], li: ['style'] },
        allowedStyles: { li: { 'list-style-type': [/^(disc|decimal)$/] } },
        allowedSchemes: ['http', 'https', 'mailto'],
        transformTags: {
            li: (_tagName, attribs) => {
                const listStyle = attribs['data-list'] === 'bullet' ? 'disc'
                    : attribs['data-list'] === 'ordered' ? 'decimal'
                        : (attribs.style || '').match(/list-style-type:\s*(disc|decimal)(?:\s*;|\s*$)/i)?.[1];
                return { tagName: 'li', attribs: listStyle ? { style: `list-style-type: ${listStyle}` } : {} };
            }
        }
    }));
}

// GIAT's detail page only renders body_content. Include an announcement's
// summary there as HTML, preserving legacy plain text and its line breaks.
function announcementBody(excerpt, message, excerptHtml = '') {
    if (!excerpt || excerpt === message) return message;
    const paragraph = text => `<p>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n?|\n/g, '<br>')}</p>`;
    const body = message.trimStart().startsWith('<') ? message : (message ? paragraph(message) : '');
    return [excerptHtml || paragraph(excerpt), body].filter(Boolean).join('\n');
}

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
        // Keep the original message when normalizing a legacy announcement
        // again: body_content may already include the rendered summary.
        template === 'pengumuman' ? post.description : undefined,
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
    const normalizedRichExcerpt = template === 'pengumuman' && typeof data.excerpt_html === 'string'
        ? safeExcerptHtml(data.excerpt_html)
        : '';
    let normalizedContent = content;
    if (!custom) {
        const item = {
            ...data,
            ...(wrappedPost ? fields : {}),
            excerpt: normalizedExcerpt,
            ...(template === 'pengumuman' && typeof data.excerpt_html === 'string' && {
                excerpt_html: normalizedRichExcerpt
            }),
            body_content: template === 'pengumuman'
                ? announcementBody(normalizedExcerpt, normalizedDescription, normalizedRichExcerpt)
                : normalizedDescription
        };
        normalizedContent = Array.isArray(content) ? [item, ...content.slice(1)] : [item];
    }

    return {
        ...post,
        content: normalizedContent,
        excerpt: normalizedExcerpt,
        ...(template === 'pengumuman' && { excerpt_html: normalizedRichExcerpt }),
        summary: normalizedExcerpt,
        description: normalizedDescription
    };
}

module.exports = { normalizePostText };
