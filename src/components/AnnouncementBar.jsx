import React from 'react';
import { MapPin, Mail, Truck } from 'lucide-react';
import { SocialLinks } from './Brand';

export default function AnnouncementBar() {
  return (
    <div className="topbar">
      <div className="container topbar__inner">
        <ul className="topbar__list">
          <li><MapPin size={17} /> Australian owned, based in Sydney</li>
          <li className="topbar__sep hidden-mobile">/</li>
          <li className="hidden-mobile"><Mail size={17} /> <a href="mailto:info@cozycubs.au">info@cozycubs.au</a></li>
        </ul>
        <ul className="topbar__list hidden-tablet">
          <li><Truck size={17} /> Free tracked shipping over $120</li>
          <li className="topbar__sep">/</li>
          <li><SocialLinks size={16} /></li>
        </ul>
      </div>
    </div>
  );
}
