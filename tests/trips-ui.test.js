import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { afterEach, describe, expect, test, vi } from 'vitest';

const clientScript = readFileSync(new URL('../public/js/main.js', import.meta.url), 'utf8');

const createSelect = () => ({
    value: 'all',
    children: [],
    listeners: {},
    appendChild(option) {
        this.children.push(option);
    },
    addEventListener(event, handler) {
        this.listeners[event] = handler;
    }
});

const runTripsHydration = async (fetchMock) => {
    let onReady;
    const list = {
        children: [],
        replaceChildren(fragment) {
            this.children = fragment.children;
        }
    };
    const loading = { hidden: false };
    const error = {
        hidden: true,
        textContent: 'Unable to load trips right now. Please try again in a moment.'
    };
    const empty = { hidden: true };
    const filters = { dataset: { selectedRegion: 'all', selectedSeason: 'all' } };
    const regionFilter = createSelect();
    const seasonFilter = createSelect();
    const nodes = {
        'trips-list': list,
        'trip-card-template': { content: { cloneNode: () => ({}) } },
        'trips-loading': loading,
        'trips-error': error,
        'trips-empty': empty,
        filters,
        'region-filter': regionFilter,
        'season-filter': seasonFilter
    };
    const document = {
        addEventListener(event, handler) {
            if (event === 'DOMContentLoaded') onReady = handler;
        },
        getElementById(id) {
            return nodes[id] ?? null;
        },
        createDocumentFragment() {
            return {
                children: [],
                appendChild(child) {
                    this.children.push(child);
                }
            };
        },
        createElement(tagName) {
            return { tagName, value: '', textContent: '', selected: false };
        }
    };

    runInNewContext(clientScript, {
        document,
        fetch: fetchMock,
        URL,
        window: {
            location: { href: 'http://localhost/trips' },
            history: { replaceState: vi.fn() }
        }
    });
    onReady();
    await new Promise((resolve) => setTimeout(resolve, 0));

    return { list, loading, error, empty };
};

afterEach(() => vi.restoreAllMocks());

describe('Trips browser hydration states', () => {
    test('shows the empty state when the API returns no trips', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ trips: [] })
        });

        const result = await runTripsHydration(fetchMock);

        expect(fetchMock).toHaveBeenCalledWith('/api/trips');
        expect(result.loading.hidden).toBe(true);
        expect(result.empty.hidden).toBe(false);
        expect(result.error.hidden).toBe(true);
        expect(result.list.children).toHaveLength(0);
    });

    test('shows the safe error state when the API request fails', async () => {
        const fetchMock = vi.fn().mockRejectedValue(new Error('private network detail'));

        const result = await runTripsHydration(fetchMock);

        expect(result.loading.hidden).toBe(true);
        expect(result.error.hidden).toBe(false);
        expect(result.error.textContent).toContain('Unable to load trips');
        expect(result.error.textContent).not.toContain('private network detail');
        expect(result.empty.hidden).toBe(true);
    });

    test('treats an unsuccessful HTTP response as an error state', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 503 });

        const result = await runTripsHydration(fetchMock);

        expect(result.loading.hidden).toBe(true);
        expect(result.error.hidden).toBe(false);
        expect(result.empty.hidden).toBe(true);
    });
});
