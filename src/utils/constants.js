const viteApiRoot = import.meta.env.VITE_API_ROOT
const buildMode = import.meta.env.VITE_BUILD_MODE || process.env.BUILD_MODE

let apiRoot = 'https://trello-api-web.onrender.com'

if (buildMode === 'dev') {
  apiRoot = 'http://localhost:8017'
}

if (viteApiRoot) {
  apiRoot = viteApiRoot
}

export const API_ROOT = apiRoot

// Pagination
export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}

export const INVITATION_TYPES = {
  BOARD_INVITATION: 'BOARD_INVITATION'
}

export const BOARD_ALLOW_STATUS = {
  ALLOW: 'ALLOW',
  NOTALLOW: 'NOTALLOW'
}
