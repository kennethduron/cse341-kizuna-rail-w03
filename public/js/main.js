const hookTrainsCatalog = async () => {
    const listEl = document.getElementById('trains-list');
    const templateEl = document.getElementById('train-card-template');
    const loadingEl = document.getElementById('trains-loading');
    const errorEl = document.getElementById('trains-error');

    if (!listEl || !templateEl) {
        return;
    }

    try {
        const response = await fetch('/api/trains');
        if (!response.ok) {
            throw new Error(`Failed to load trains (${response.status})`);
        }

        const payload = await response.json();
        const trains = payload.trains || [];
        const fragment = document.createDocumentFragment();

        trains.forEach((train) => {
            const card = templateEl.content.cloneNode(true);
            const imageEl = card.querySelector('[data-field="image"]');

            imageEl.src = train.imageUrl;
            imageEl.alt = train.imageAlt || `${train.name} train`;

            card.querySelector('[data-field="name"]').textContent = train.name;
            card.querySelector('[data-field="operator"]').textContent = train.operator;
            card.querySelector('[data-field="type"]').textContent = train.type;
            card.querySelector('[data-field="speed"]').textContent = `${train.maxSpeedKmh} km/h`;
            card.querySelector('[data-field="seats"]').textContent = `${train.capacity} seats`;
            card.querySelector('[data-field="power"]').textContent = train.powerSource;
            card.querySelector('[data-field="description"]').textContent = train.description;
            card.querySelector('[data-field="best-for"]').textContent = train.bestFor;

            fragment.appendChild(card);
        });

        listEl.replaceChildren(fragment);
        if (loadingEl) {
            loadingEl.hidden = true;
        }
    } catch (error) {
        if (loadingEl) {
            loadingEl.hidden = true;
        }
        if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = 'Unable to load trains right now. Please try again in a moment.';
        }
    }
};

const hookTripsCatalog = async () => {
    const listEl = document.getElementById('trips-list');
    const templateEl = document.getElementById('trip-card-template');
    const loadingEl = document.getElementById('trips-loading');
    const errorEl = document.getElementById('trips-error');
    const emptyEl = document.getElementById('trips-empty');
    const filtersEl = document.getElementById('filters');
    const regionFilter = document.getElementById('region-filter');
    const seasonFilter = document.getElementById('season-filter');

    if (!listEl || !templateEl || !loadingEl || !errorEl || !emptyEl || !filtersEl || !regionFilter || !seasonFilter) {
        return;
    }

    const setText = (root, selector, value) => {
        root.querySelector(selector).textContent = String(value ?? '');
    };

    const createCard = (trip) => {
        const card = templateEl.content.cloneNode(true);
        const article = card.querySelector('.route-card');
        const regionClass = /^[a-z0-9-]+$/.test(trip.region) ? trip.region : '';
        if (regionClass) {
            article.classList.add(regionClass);
        }

        setText(card, '[data-field="name"]', trip.name);
        setText(card, '[data-field="region"]', trip.region);
        setText(card, '[data-field="start"]', trip.startStation);
        setText(card, '[data-field="end"]', trip.endStation);
        setText(card, '[data-field="duration"]', trip.duration);
        setText(card, '[data-field="distance"]', trip.distance);
        setText(card, '[data-field="description"]', trip.description);

        const season = card.querySelector('[data-field="season"]');
        season.textContent = `Best in ${trip.bestSeason}`;
        const seasonClass = /^[a-z0-9-]+$/.test(trip.bestSeason) ? trip.bestSeason : '';
        if (seasonClass) {
            season.classList.add(`season-${seasonClass}`);
        }

        const highlights = card.querySelector('[data-field="highlights"]');
        (Array.isArray(trip.highlights) ? trip.highlights : []).forEach((highlight) => {
            const tag = document.createElement('span');
            tag.className = 'highlight-tag';
            tag.textContent = String(highlight);
            highlights.appendChild(tag);
        });

        const detailsLink = card.querySelector('[data-field="details"]');
        detailsLink.href = `/trips/${encodeURIComponent(trip.id)}`;
        return card;
    };

    try {
        const response = await fetch('/api/trips');
        if (!response.ok) {
            throw new Error(`Trips request failed (${response.status})`);
        }

        const payload = await response.json();
        const trips = Array.isArray(payload.trips) ? payload.trips : [];
        const selectedRegion = filtersEl.dataset.selectedRegion || 'all';
        const selectedSeason = filtersEl.dataset.selectedSeason || 'all';

        const addOptions = (select, values, selected) => {
            [...new Set(values.filter(Boolean))].sort().forEach((value) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
                option.selected = value === selected;
                select.appendChild(option);
            });
        };
        addOptions(regionFilter, trips.map((trip) => trip.region), selectedRegion);
        addOptions(seasonFilter, trips.map((trip) => trip.bestSeason), selectedSeason);

        const renderTrips = () => {
            const visibleTrips = trips.filter((trip) =>
                (regionFilter.value === 'all' || trip.region === regionFilter.value)
                && (seasonFilter.value === 'all' || trip.bestSeason === seasonFilter.value)
            );
            const fragment = document.createDocumentFragment();
            visibleTrips.forEach((trip) => fragment.appendChild(createCard(trip)));
            listEl.replaceChildren(fragment);
            emptyEl.hidden = visibleTrips.length > 0;

            const url = new URL(window.location.href);
            if (regionFilter.value === 'all') {
                url.searchParams.delete('region');
            } else {
                url.searchParams.set('region', regionFilter.value);
            }
            if (seasonFilter.value === 'all') {
                url.searchParams.delete('season');
            } else {
                url.searchParams.set('season', seasonFilter.value);
            }
            window.history.replaceState({}, '', url);
        };

        regionFilter.addEventListener('change', renderTrips);
        seasonFilter.addEventListener('change', renderTrips);
        renderTrips();
    } catch {
        errorEl.hidden = false;
    } finally {
        loadingEl.hidden = true;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    hookTrainsCatalog();
    hookTripsCatalog();
});
