import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/index.tsx'
import { Toaster } from 'sonner'
import { SocketContextProvider } from './context/SocketContext.tsx'
import { CallContextProvider } from './context/CallContextProvider.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SocketContextProvider>
        <CallContextProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="top-center" />
        </CallContextProvider>
      </SocketContextProvider>
    </QueryClientProvider>
  </StrictMode>,
)
