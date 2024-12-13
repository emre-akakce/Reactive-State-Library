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
        // Example 1: Reactive Counter
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

        // Example 2: Nested Reactivity
        const userState = ReactiveState(
            { user: { name: "Alice", age: 25 } },
            (property, value) => {
                console.log(`Property '${property}' updated to: ${value}`);
                if (property === "name") {
                    document.getElementById("userNameDisplay").textContent = value;
                }
                if (property === "age") {
                    document.getElementById("userAgeDisplay").textContent = value;
                }
            }
        );

        // Set up UI elements for nested reactivity
        document.getElementById("changeNameBtn").addEventListener("click", () => {
            userState.user.name = "Bob";
        });
        document.getElementById("incrementAgeBtn").addEventListener("click", () => {
            userState.user.age += 1;
        });

        // Example 3: Logging State Changes
        const loggingState = ReactiveState(
            { action: "none" },
            (property, value) => {
                console.log(`Action '${property}' set to: ${value}`);
            }
        );

        // Change state to trigger logging
        loggingState.action = "clicked";
        loggingState.action = "submitted";
    });
}
