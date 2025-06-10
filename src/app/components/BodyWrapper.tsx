'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '../components/SideBar';
import ChatTest from '../components/agents/ChatTest';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const bodyClass = isAuthRoute ? '' : 'flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-900';

  return (
    <Provider store={store}>
      <body className={bodyClass}>
        {!isAuthRoute && <Sidebar />}
        <main className="w-full">
          {children}
          {!isAuthRoute && <ChatTest />}
        </main>
      </body>
    </Provider>
  );
}
