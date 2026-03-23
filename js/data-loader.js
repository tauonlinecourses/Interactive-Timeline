// Data loading: fetch events JSON and bootstrap timeline.

let infoData = null;
let fitZoomResizeTimeout = null;
let fitZoomResizeHandlerInstalled = false;

async function loadInfo() {
    try {
        const response = await fetch(activeTimeline.infoFile);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        infoData = await response.json();
        // Populate the info modal content immediately after loading
        populateInfoModal();
    } catch (error) {
        console.error('Error loading info.json:', error);
        // Set default fallback data if loading fails
        infoData = {
            "הקדמה": "לא ניתן לטעון את תוכן ההקדמה.",
            "איך משתמשים בציר הזמן?": "לא ניתן לטעון את תוכן ההוראות.",
            "קרדיטים": "לא ניתן לטעון את תוכן הקרדיטים."
        };
        populateInfoModal();
    }
}

function populateInfoModal() {
    const contentSections = document.querySelector('.info-modal-content-sections');
    
    if (infoData && contentSections) {
        contentSections.innerHTML = '';
        
        // Iterate through infoData and create sections dynamically
        Object.entries(infoData).forEach(([title, text]) => {
            // Skip the video link section - info modal now uses PDF link + image instead
            if (title === 'קישור לסרטון הסבר') {
                return;
            }
            
            const section = document.createElement('div');
            section.className = 'info-section';
            
            const sectionTitle = document.createElement('h3');
            sectionTitle.className = 'info-section-title';
            sectionTitle.textContent = title;
            
            const sectionText = document.createElement('p');
            sectionText.className = 'info-section-text';
            sectionText.textContent = text;
            
            section.appendChild(sectionTitle);
            section.appendChild(sectionText);
            contentSections.appendChild(section);
        });
    }
}

async function loadEvents() {
    try {
        const response = await fetch(activeTimeline.eventsFile);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        events = await response.json();

        events.forEach(event => {
            event.categories = deriveCategoriesFromDescriptions(event);
        });

        if (events.length === 0) {
            throw new Error('No events found in JSON file');
        }

        mapCategoriesToColors();
        const { eventIndex } = readURLParams();
        renderCategoryButtons();

        minYear = Math.min(...events.map(event => event.start_year));
        maxYear = Math.max(...events.map(event => event.end_year));

        // Calculate the ideal zoom level so all events fill the viewport width
        // and set it as the max zoom-out limit for this timeline
        const scrollable = getTimelineScrollable();
        if (scrollable) {
            const viewportWidth = scrollable.clientWidth;
            const yearRange = maxYear - minYear + 1;
            if (yearRange > 0 && viewportWidth > 0) {
                const idealYearWidth = viewportWidth / yearRange;
                // Make "max zoom out" a true fit-to-viewport value.
                // We intentionally allow going below the initial hardcoded zoom floor
                // so smaller screens don't end up with horizontal scrolling.
                //
                // A small safety factor helps prevent rare 1px overflow due to rounding
                // and the top-layer overlap spreading.
                const fitSafetyFactor = 0.995;
                yearWidth = Math.min(idealYearWidth * fitSafetyFactor, maxZoomIn);
                // Set this as the max zoom-out (minimum yearWidth) for this timeline.
                maxZoomOut = yearWidth;
                setZoomButtonStates();
            }
        }

        renderTimeline(true);

        // Keep fit-to-viewport zoom correct when resizing (e.g. laptop window / DPI changes).
        if (!fitZoomResizeHandlerInstalled) {
            fitZoomResizeHandlerInstalled = true;
            window.addEventListener('resize', () => {
                if (fitZoomResizeTimeout) clearTimeout(fitZoomResizeTimeout);
                fitZoomResizeTimeout = setTimeout(() => {
                    const scrollable = getTimelineScrollable();
                    if (!scrollable || minYear === null || maxYear === null) return;

                    const viewportWidth = scrollable.clientWidth;
                    const yearRange = maxYear - minYear + 1;
                    if (!(yearRange > 0 && viewportWidth > 0)) return;

                    const previousMaxZoomOut = maxZoomOut;
                    const previousYearWidth = yearWidth;

                    const idealYearWidth = viewportWidth / yearRange;
                    const fitSafetyFactor = 0.995;
                    const newMaxZoomOut = Math.min(idealYearWidth * fitSafetyFactor, maxZoomIn);

                    if (!Number.isFinite(newMaxZoomOut) || newMaxZoomOut <= 0) return;

                    maxZoomOut = newMaxZoomOut;

                    const EPS = 0.0001;
                    const wasAtMinZoomOut = previousYearWidth <= previousMaxZoomOut + EPS;
                    const isBelowNewMin = previousYearWidth < newMaxZoomOut - EPS;

                    // If the user was already at max zoom out, keep it fitting after resize.
                    // If the new "min zoom out" is higher, clamp back into the valid range.
                    if (wasAtMinZoomOut || isBelowNewMin) {
                        updateZoom(newMaxZoomOut, { anchor: { type: 'center' } });
                    } else {
                        setZoomButtonStates();
                    }
                }, 150);
            });
        }

        if (typeof eventIndex === 'number' && eventIndex >= 0 && eventIndex < events.length) {
            showEventModal(events[eventIndex], { skipHistoryUpdate: true });
        }

        // Start preloading event images in the background
        preloadEventImages(events, {
            onProgress: (loaded, total) => {
                // Optional: log progress for debugging
                if (loaded % 5 === 0 || loaded === total) {
                    console.log(`[Image Preloader] Progress: ${loaded}/${total}`);
                }
            },
            onComplete: (status) => {
                console.log(`[Image Preloader] Finished: ${status.loaded} images cached, ${status.failed} failed`);
            }
        });

        setTimeout(() => {
            isInitialRender = false;
        }, 100);
    } catch (error) {
        console.error('Error loading events:', error);

        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') ||
            error.name === 'TypeError' || window.location.protocol === 'file:') {
            displayError(
                'Failed to load racism-events.json. This usually happens when opening the file directly.<br><br>' +
                '<strong>Solution:</strong> Run a local server:<br>' +
                '• Python: <code>python -m http.server 8000</code> then visit <code>http://localhost:8000</code><br>' +
                '• Node.js: <code>npx http-server</code> then visit the shown URL<br><br>' +
                'Or check the browser console for more details.'
            );
        } else {
            displayError(`Failed to load events. Error: ${error.message}<br><br>Please check that racism-events.json exists and is valid JSON.`);
        }
    }
}

