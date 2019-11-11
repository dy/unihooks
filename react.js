import { useState, useEffect } from 'react'

import { useLocalStorage } from './src/useLocalStorage'

export const useLocalStorage = useLocalStorage.bind({ useState, useEffect })
