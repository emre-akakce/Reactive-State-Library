# Simple Reactive State Library

A lightweight JavaScript library for managing reactive state with automatic updates, nested reactivity, and state change tracking. This library is ideal for small projects that need a straightforward way to manage state without relying on larger frameworks.

---

## Features

- **Reactive State Management**: Automatically update UI elements when state changes.
- **Nested Reactivity**: Supports nested objects, ensuring changes in any part of the state tree are tracked.
- **State Change Tracking**: Logs all state changes, including old and new values, with timestamps.
- **Lightweight**: Pure JavaScript with no external dependencies.

---

## Usage

### Including the Library

Save the JavaScript library code in a file named `rsl.js` and include it in your HTML:

```html
<script src="rsl.js"></script>
```

### Example HTML Setup

Add the following elements to your HTML to test the library:

```html
<div id="counterApp">
    <h1 id="countDisplay">0</h1>
    <button id="incrementBtn">Increment</button>
</div>

<div id="nestedExample">
    <h2>User Info</h2>
    <p>Name: <span id="userNameDisplay">Alice</span></p>
    <p>Age: <span id="userAgeDisplay">25</span></p>
    <button id="changeNameBtn">Change Name</button>
    <button id="incrementAgeBtn">Increment Age</button>
</div>

<div id="loggingExample">
    <button id="showHistoryBtn">Show State History</button>
</div>
```

---

## API

### `ReactiveState(initialState, callback)`

Creates a reactive state object.

#### Parameters:
- `initialState` (Object): The initial state object to make reactive.
- `callback` (Function): A function to call whenever a property in the state changes.

#### Returns:
An object containing:
- `proxy` (Proxy): The reactive state object.
- `getStateHistory` (Function): Returns an array of all tracked state changes.

---

## Examples

### Reactive Counter

```javascript
const { proxy: appState } = ReactiveState(
    { count: 0 },
    (property, value) => {
        if (property === "count") {
            document.getElementById("countDisplay").textContent = value;
        }
    }
);

document.getElementById("incrementBtn").addEventListener("click", () => {
    appState.count += 1;
});
```

### Nested Reactivity

```javascript
const { proxy: userState } = ReactiveState(
    { user: { name: "Alice", age: 25 } },
    (property, value) => {
        if (property === "name") {
            document.getElementById("userNameDisplay").textContent = value;
        }
        if (property === "age") {
            document.getElementById("userAgeDisplay").textContent = value;
        }
    }
);

document.getElementById("changeNameBtn").addEventListener("click", () => {
    userState.user.name = "Bob";
});
document.getElementById("incrementAgeBtn").addEventListener("click", () => {
    userState.user.age += 1;
});
```

### State Change Tracking

```javascript
const { proxy: loggingState, getStateHistory } = ReactiveState(
    { action: "none" },
    (property, value) => {
        console.log(`Action '${property}' set to: ${value}`);
    }
);

loggingState.action = "clicked";
loggingState.action = "submitted";

document.getElementById("showHistoryBtn").addEventListener("click", () => {
    console.log("State History:", getStateHistory());
});
```

---

## State History Output Example

When `getStateHistory` is called, it returns an array of all state changes:

```javascript
[
    {
        property: "count",
        oldValue: 0,
        newValue: 1,
        timestamp: "2024-12-13T14:45:00.000Z"
    },
    {
        property: "user.name",
        oldValue: "Alice",
        newValue: "Bob",
        timestamp: "2024-12-13T14:46:00.000Z"
    },
    {
        property: "user.age",
        oldValue: 25,
        newValue: 26,
        timestamp: "2024-12-13T14:47:00.000Z"
    }
]
```

---

## License

This library is open-source and available under the MIT License.

