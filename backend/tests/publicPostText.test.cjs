const assert = require('node:assert/strict');
const { test } = require('node:test');
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const { normalizePostText } = require('../utils/postText');

// Exercise the actual public router and API-key middleware without a remote DB.
// Fixtures match the JSON array saved by the Postingan form.
const fixtures = [
    { id: 1, tenant_id: 7, slug: 'artikel', template_type: 'Artikel', excerpt: 'Ringkasan&nbsp;baru', content: JSON.stringify([{ excerpt: 'Ringkasan lama', body_content: '<p>Isi&nbsp;artikel</p>', featured_image: '/uploads/article.jpg' }]) },
    { id: 2, tenant_id: 7, slug: 'event', template_type: 'Event', excerpt: 'Ringkasan acara', content: JSON.stringify([{ event_description: '<p>Deskripsi acara</p>' }]) },
    { id: 3, tenant_id: 7, slug: 'template', template_type: 'Template', excerpt: '', content: JSON.stringify([{ excerpt: 'Stale', short_description: 'Deskripsi template' }]) },
    { id: 4, tenant_id: 7, slug: 'legacy', excerpt: null, content: { excerpt: 'Ringkasan legacy', body: '<p>Deskripsi legacy</p>' } },
    { id: 5, tenant_id: 7, slug: 'html', excerpt: 'Ringkasan HTML', content: '<p>Deskripsi HTML</p>' },
    { id: 6, tenant_id: 7, slug: 'custom', template_type: 'Custom', excerpt: 'Ringkasan custom', content: JSON.stringify([{ type: 'hero', description: 'Bukan deskripsi postingan', data: { title: 'Hero' } }]) },
    { id: 7, tenant_id: 7, slug: 'wrapped-event', content: JSON.stringify([{ type: 'post_event', data: { excerpt: 'Ringkasan blok acara', event_description: '<p>Deskripsi blok acara</p>', location: 'Auditorium' } }]) },
    { id: 8, tenant_id: 7, slug: 'json-object', template_type: 'Artikel', content: JSON.stringify({ excerpt: 'Ringkasan objek', body_content: '<p>Deskripsi objek</p>', tags: ['Berita'] }) },
    { id: 9, tenant_id: 7, slug: 'description-field', template_type: 'Artikel', excerpt: 'Ringkasan deskripsi', content: [{ description: '<p>Deskripsi lama</p>' }] },
    { id: 10, tenant_id: 7, slug: 'pengambilan-toga', template_type: 'Pengumuman', excerpt: 'Toga wisuda dapat diambil mulai 9 November 2026.', content: JSON.stringify([{ excerpt: 'Ringkasan lama', alert_message: 'Halo Wisudawan/Wisudawati!\n\nToga sudah dapat diambil di Koperasi GIAT.', urgency_level: 'High', expiry_date: '2026-11-25' }]) },
    { id: 11, tenant_id: 7, slug: 'pengumuman-rich-text', template_type: 'Pengumuman', excerpt: 'Pengambilan toga mulai Senin. Lihat jadwal.', content: JSON.stringify([{ excerpt: 'Pengambilan toga mulai Senin. Lihat jadwal.', excerpt_html: '<p>Pengambilan toga <strong>mulai Senin</strong>.</p><p><a href="https://example.com/jadwal">Lihat jadwal</a>.</p>', alert_message: 'Bawa kartu mahasiswa.' }]) }
];
const dbPath = require.resolve('../server/lib/db');
require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: {
    async execute(sql, params) {
        if (sql.includes('FROM api_keys')) {
            return [params[0] === 'test-key' ? [{ tenant_id: 7 }] : []];
        }
        assert.match(sql, /posts\.tenant_id = \?/);
        assert.match(sql, /posts\.status = 'published'/);
        assert.equal(params[0], 7);
        const posts = sql.includes('posts.slug = ?') ? fixtures.filter(post => post.slug === params[1]) : fixtures;
        return [structuredClone(posts)];
    }
} };
const router = require('../server/routes/data');

test('public list and detail expose matching summaries and descriptions from saved posts', async t => {
    const app = express();
    app.use('/api/v1/public', router);
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    t.after(() => new Promise(resolve => server.close(resolve)));
    const base = `http://127.0.0.1:${server.address().port}/api/v1/public/posts`;
    const get = path => fetch(base + path, { headers: { 'x-api-key': 'test-key' } });
    const response = await get('');
    assert.equal(response.status, 200);
    const posts = await response.json();
    assert.equal(posts.length, fixtures.length);
    const descriptions = ['<p>Isi artikel</p>', '<p>Deskripsi acara</p>', 'Deskripsi template', '<p>Deskripsi legacy</p>', '<p>Deskripsi HTML</p>', '', '<p>Deskripsi blok acara</p>', '<p>Deskripsi objek</p>', '<p>Deskripsi lama</p>', 'Halo Wisudawan/Wisudawati!\n\nToga sudah dapat diambil di Koperasi GIAT.', 'Bawa kartu mahasiswa.'];
    const summaries = ['Ringkasan baru', 'Ringkasan acara', '', 'Ringkasan legacy', 'Ringkasan HTML', 'Ringkasan custom', 'Ringkasan blok acara', 'Ringkasan objek', 'Ringkasan deskripsi', 'Toga wisuda dapat diambil mulai 9 November 2026.', 'Pengambilan toga mulai Senin. Lihat jadwal.'];
    for (const [index, post] of posts.entries()) {
        await t.test(post.slug, async () => {
            assert.equal(post.excerpt, summaries[index]);
            assert.equal(post.summary, summaries[index]);
            assert.equal(post.description, descriptions[index]);
            if (post.template_type !== 'Custom') {
                // Exact field paths used by koperasi_giat's Home,
                // Information and InformationDetail normalizeCmsPost adapters.
                const contentItem = post.content?.[0];
                const giatExcerpt = post.excerpt || contentItem?.excerpt || '';
                const giatContent = contentItem?.body_content || '';
                assert.equal(giatExcerpt, summaries[index]);
                if (post.template_type === 'Pengumuman') {
                    if (post.slug === 'pengumuman-rich-text') {
                        assert.equal(contentItem.excerpt_html, JSON.parse(fixtures[index].content)[0].excerpt_html);
                        assert.equal(post.excerpt_html, contentItem.excerpt_html);
                        assert.equal(giatContent, '<p>Pengambilan toga <strong>mulai Senin</strong>.</p><p><a href="https://example.com/jadwal">Lihat jadwal</a>.</p>\n<p>Bawa kartu mahasiswa.</p>');
                    } else {
                        assert.equal(giatContent, '<p>Toga wisuda dapat diambil mulai 9 November 2026.</p>\n<p>Halo Wisudawan/Wisudawati!<br><br>Toga sudah dapat diambil di Koperasi GIAT.</p>');
                    }
                    assert.equal(contentItem.alert_message, descriptions[index]);
                    if (post.slug === 'pengambilan-toga') {
                        assert.equal(contentItem.urgency_level, 'High');
                        assert.equal(contentItem.expiry_date, '2026-11-25');
                    }
                } else {
                    assert.equal(giatContent, descriptions[index]);
                }
                assert.equal(contentItem.excerpt, summaries[index]);
            }
            const detail = await get(`/${post.slug}`);
            assert.equal(detail.status, 200);
            assert.deepEqual(await detail.json(), post);
        });
    }
    assert.ok(Array.isArray(posts[0].content));
    assert.equal(posts[0].content[0].body_content, '<p>Isi artikel</p>');
    assert.equal(posts[0].content[0].featured_image, '/uploads/article.jpg');
    assert.deepEqual(posts[5].content, JSON.parse(fixtures[5].content));
    assert.equal(posts[6].content[0].data.location, 'Auditorium');
    assert.deepEqual(posts[7].content[0].tags, ['Berita']);
    assert.equal((await get('/missing')).status, 404);
    assert.equal((await fetch(base)).status, 401);
    assert.equal((await fetch(base, { headers: { 'x-api-key': 'invalid' } })).status, 401);
});

test('empty posts and other template text are handled without mutating saved records', () => {
    assert.deepEqual(normalizePostText({ content: null }), { content: [{ excerpt: '', body_content: '' }], excerpt: '', summary: '', description: '' });
    for (const [template_type, field] of [['Lowongan', 'requirements'], ['Pengumuman', 'alert_message']]) {
        const post = { template_type, content: [{ [field]: 'Deskripsi', excerpt: 'Ringkasan' }] };
        const original = structuredClone(post);
        assert.equal(normalizePostText(post).description, 'Deskripsi');
        assert.equal(normalizePostText(post).summary, 'Ringkasan');
        assert.deepEqual(post, original);
    }
});

test('custom blocks stay unchanged even when the template type is missing', () => {
    const content = [{ type: 'rich-text', data: { content: '<p>A block</p>' } }];
    const post = { excerpt: 'Ringkasan', content };
    const normalized = normalizePostText(post);
    assert.deepEqual(normalized.content, content);
    assert.equal(normalized.description, '');
});

test('repeated normalization preserves template fields and additional content items', () => {
    const post = { template_type: 'Event', excerpt: 'Ringkasan', content: [{ event_description: '<p>Deskripsi</p>', speakers: ['Nama'] }, { metadata: true }] };
    const original = structuredClone(post);
    const normalized = normalizePostText(post);
    assert.deepEqual(normalizePostText(normalized), normalized);
    assert.deepEqual(normalized.content[0].speakers, ['Nama']);
    assert.deepEqual(normalized.content[1], { metadata: true });
    assert.deepEqual(post, original);
});

test('announcement summaries are escaped, displayed before the message and not duplicated on normalization', () => {
    const post = { template_type: 'Pengumuman', excerpt: 'Toga <img src=x onerror=alert(1)> & jadwal\nBaris kedua', content: [{ alert_message: 'Halo <Wisudawan> & Wisudawati!\r\n\r\nPukul 08.00–16.00 WIB' }] };
    const original = structuredClone(post);
    const normalized = normalizePostText(post);
    assert.equal(normalized.content[0].body_content, '<p>Toga &lt;img src=x onerror=alert(1)&gt; &amp; jadwal<br>Baris kedua</p>\n<p>Halo &lt;Wisudawan&gt; &amp; Wisudawati!<br><br>Pukul 08.00–16.00 WIB</p>');
    assert.equal(normalized.excerpt, post.excerpt);
    assert.equal(normalized.description, post.content[0].alert_message);
    assert.equal(normalized.content[0].alert_message, post.content[0].alert_message);
    assert.deepEqual(normalizePostText(normalized), normalized);
    assert.deepEqual(post, original);
});

test('announcement HTML stays formatted and legacy messages also get the summary', () => {
    const post = { category: 'Pengumuman', excerpt: 'Ringkasan', content: [{ body_content: '<p>Pesan <strong>penting</strong></p>' }] };
    const normalized = normalizePostText(post);
    assert.equal(normalized.content[0].body_content, '<p>Ringkasan</p>\n<p>Pesan <strong>penting</strong></p>');
    assert.equal(normalized.description, '<p>Pesan <strong>penting</strong></p>');
    assert.deepEqual(normalizePostText(normalized), normalized);
});

test('announcement body stays unchanged when summary is empty or identical to the message', () => {
    for (const excerpt of ['', 'Pesan pengumuman']) {
        const normalized = normalizePostText({ template_type: 'Pengumuman', excerpt, content: [{ alert_message: 'Pesan pengumuman' }] });
        assert.equal(normalized.content[0].body_content, 'Pesan pengumuman');
    }
});

test('announcement Rich Text keeps supported formatting and removes unsafe markup before GIAT renders it', () => {
    const html = '<h2>Jadwal <em>baru</em></h2><ol><li data-list="bullet"><span class="ql-ui"></span>FEB</li></ol><p><a href="javascript:alert(1)">tautan</a><script>alert(1)</script><img src=x onerror=alert(1)></p>';
    const post = { template_type: 'Pengumuman', excerpt: 'Jadwal baru FEB tautan', content: [{ excerpt_html: html, alert_message: 'Silakan hadir.' }] };
    const normalized = normalizePostText(post);
    const rich = normalized.content[0].excerpt_html;
    assert.equal(normalized.excerpt_html, rich);
    assert.match(rich, /<h2>Jadwal <em>baru<\/em><\/h2>/);
    assert.match(rich, /list-style-type:\s*disc/);
    assert.doesNotMatch(rich, /javascript:|<script|<img|onerror|ql-ui/);
    assert.equal(normalized.content[0].body_content, `${rich}\n<p>Silakan hadir.</p>`);
    assert.equal(normalized.excerpt, 'Jadwal baru FEB tautan');
    assert.deepEqual(normalizePostText(normalized), normalized);
});

test('CMS integration examples document the real post response shape consumed by GIAT', () => {
    const source = fs.readFileSync(path.join(__dirname, '../../src/pages/ApiIntegration.tsx'), 'utf8');
    const examples = [...source.matchAll(/path: '\/api\/v1\/public\/posts(?:\/:slug)?',[\s\S]*?response: `([\s\S]*?)`/g)];
    // Only list and detail response examples are relevant here.
    assert.equal(examples.length, 2);
    const list = JSON.parse(examples[0][1]);
    const detail = JSON.parse(examples[1][1]);
    assert.ok(Array.isArray(list));
    assert.deepEqual(list[0], detail);
    assert.ok(detail.excerpt);
    assert.equal(detail.content[0].excerpt, detail.excerpt);
    assert.ok(detail.content[0].body_content);
    assert.equal(detail.description, detail.content[0].body_content);
});
