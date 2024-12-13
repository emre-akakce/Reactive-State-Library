// Simple Reactive State Library with Comprehensive State Tracking
(function (global) {
    /**
     * ReactiveState - A simple reactive state management library with comprehensive state tracking.
     *
     * @param {Object} initialState - The initial state object.
     * @param {Function} callback - Function to call whenever the state changes.
     * @returns {Object} An object containing the reactive proxy and methods for tracking state.
     */
    function ReactiveState(initialState, callback) {
        if (typeof initialState !== 'object' || initialState === null) {
            throw new Error("Initial state must be a non-null object.");
        }

        if (typeof callback !== 'function') {
            throw new Error("Callback must be a function.");
        }

        const stateHistory = []; // Shared array to track state changes

        function createProxy(target) {
            return new Proxy(target, {
                set(obj, property, value) {
                    const oldValue = obj[property];
                    obj[property] = value; // Update the state

                    // Log state changes
                    stateHistory.push({
                        property: `${obj === target ? '' : 'nested.'}${property}`,
                        oldValue,
                        newValue: value,
                        timestamp: new Date().toISOString(),
                    });

                    callback(property, value); // Trigger the callback
                    return true; // Indicate success
                },
                get(obj, property) {
                    const value = obj[property];
                    // Ensure nested objects are also reactive
                    return typeof value === 'object' && value !== null
                        ? createProxy(value)
                        : value;
                },
            });
        }

        const proxy = createProxy(initialState);

        return {
            proxy, // The reactive state
            getStateHistory: () => [...stateHistory], // Function to retrieve the state change history
        };
    }

    // Expose the library to the global object
    global.ReactiveState = ReactiveState;
})(this);

// Example usage
if (typeof window !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        // Example 1: Reactive Counter
        const { proxy: appState } = ReactiveState(
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
        const { proxy: userState, getStateHistory } = ReactiveState(
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
        const { proxy: loggingState } = ReactiveState(
            { action: "none" },
            (property, value) => {
                console.log(`Action '${property}' set to: ${value}`);
            }
        );

        // Change state to trigger logging
        loggingState.action = "clicked";
        loggingState.action = "submitted";

        // Display state history
        document.getElementById("showHistoryBtn").addEventListener("click", () => {
            console.log("State History:", getStateHistory());
        });
    });
}
