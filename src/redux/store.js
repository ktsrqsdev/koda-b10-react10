
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import todosReducer from "./slices/TodosSlices.js";

const persistConfig = {
    key: "root",
    storage: {
        getItem: (key) => Promise.resolve(localStorage.getItem(key)),
        setItem: (key, value) => {
            localStorage.setItem(key, value);
            return Promise.resolve(value);
        },
        removeItem: (key) => {
            localStorage.removeItem(key);
            return Promise.resolve();
        },
    },
};

const rootReducer = combineReducers({
    todos: todosReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export default store;
