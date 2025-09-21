
import dynamic from 'next/dynamic';

const OpenTermFormMobile = dynamic(() => import('./openTermMobile'), { ssr: false });
const OpenTermFormDesktop = dynamic(() => import('./openTermDesktop'), { ssr: false });

export default function OpenTermForm(props: any) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (isMobile) {
    return <OpenTermFormMobile {...props} />;
  }
  return <OpenTermFormDesktop {...props} />;
}