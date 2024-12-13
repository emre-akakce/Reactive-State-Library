// Simple Reactive State Library
(function(global) {
    /**
     * ReactiveState - A simple reactive state management library.
     *
     * @param {Object} initialState - The initial state object.
     * @param {Function} callback - Function to call whenever the state changes.
     * @returns {Proxy} A proxy-wrapped reactive state object.
     */
    function ReactiveState(initialState, callback) {
        if (typeof initialState !== 'object' || initialState === null) {
            throw new Error("Initial state must be a non-null object.");
        }

        if (typeof callback !== 'function') {
            throw new Error("Callback must be a function.");
        }

        return new Proxy(initialState, {
            set(target, property, value) {
                target[property] = value; // Update the state
                callback(property, value); // Trigger the callback
                return true; // Indicate success
            },
            get(target, property) {
                // Support nested reactivity
                const value = target[property];
                return typeof value === 'object' && value !== null
                    ? ReactiveState(value, callback)
                    : value;
            }
        });
    }

    // Expose the library to the global object
    global.ReactiveState = ReactiveState;
})(this);

// Example usage
if (typeof window !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        const appState = ReactiveState(
            { count: 0 },
            (property, value) => {
                // Update the UI when state changes
                if (property === "count") {
                    document.getElementById("countDisplay").textContent = value;
                }
            }
        );

        // Setup UI interactions
        document.getElementById("incrementBtn").addEventListener("click", () => {
            appState.count += 1;
        });
    });
}
