import dynamic from 'next/dynamic';
const Empty = () => null;
const OpenTermFormMobile = dynamic(() => import('./openTermMobile').then(mod => mod?.default || Empty), { ssr: false });
const OpenTermFormDesktop = dynamic(() => import('./openTermDesktop').then(mod => mod?.default || Empty), { ssr: false });

export default function OpenTermForm(props: any) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (isMobile) {
    return <OpenTermFormMobile {...props} />;
  }
  return <OpenTermFormDesktop {...props} />;
}
