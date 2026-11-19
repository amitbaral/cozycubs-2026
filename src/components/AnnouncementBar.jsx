import React from 'react';
import { MapPin, Sparkles, Truck } from 'lucide-react';
import { SocialLinks } from './Brand';

export default function AnnouncementBar() {
  return (
    <div className="topbar">
      <div className="container topbar__inner">
        <ul className="topbar__list">
          <li><MapPin size={15} /> Australian owned, based in Sydney</li>
          <li className="topbar__sep hidden-mobile">•</li>
          <li className="hidden-mobile"><Sparkles size={15} /> Home &amp; Living, Trending Finds, Gifts &amp; Custom Bedding</li>
        </ul>
        <ul className="topbar__list hidden-tablet">
          <li><Truck size={16} /> Free tracked AU shipping over $120</li>
          <li className="topbar__sep">•</li>
          <li><SocialLinks size={15} /></li>
        </ul>
      </div>
    </div>
  );
}
