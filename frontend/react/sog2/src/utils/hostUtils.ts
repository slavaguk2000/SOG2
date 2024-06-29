export const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost';

export const BACKEND_BASE_URL = `${BACKEND_HOST}:8000`;

export const BACKEND_GRAPHQL_URL = `${BACKEND_BASE_URL}/`;

export const BACKEND_GRAPHQL_HTTP_URL = `http://${BACKEND_GRAPHQL_URL}`;

export const BACKEND_GRAPHQL_WS_URL = `ws://${BACKEND_GRAPHQL_URL}`;

export const STATIC_IMAGES_URL = `http://${BACKEND_BASE_URL}/psalm-image/`;
