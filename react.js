import { useState, useEffect } from 'react'

import { useLocalStorage, useQuery } from './src'

export const useLocalStorage = useLocalStorage.bind({ useState, useEffect })
export const useQuery = useQuery.bind({ useState, useEffect })
