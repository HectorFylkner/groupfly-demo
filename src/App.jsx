import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  ArrowLeft, Plane, Search, User, Menu, Info, ChevronRight, Clock,
  UserPlus, Send, Share2, CreditCard, Check, Plus, X, Fuel, Lock, Unlock
} from 'lucide-react'
import './App.css'

/* ─── COLORS ─── */
const C = {
  bg: '#0C0C1E',
  card: '#1A1A2E',
  input: '#1E1E32',
  blue: '#2B6BF2',
  navy: '#000060',
  white: '#FFFFFF',
  grey: '#9CA3AF',
  greyLight: '#6B7280',
  coral: '#F87171',
  green: '#10B981',
  amber: '#F59E0B',
  disabled: '#374151',
}

/* ─── Member database (invitees — all EB members) ─── */
const ALL_MEMBERS = [
  { id: 'hector', name: 'Hector F.', tier: 'Silver', eb: 'EB-209847102', card: '4291', init: 'H', initColor: C.blue },
  { id: 'daniel', name: 'Daniel Å.', tier: 'Silver', eb: 'EB-671034825', card: '5519', init: 'D', initColor: '#10B981' },
  { id: 'fritiof', name: 'Fritiof H.', tier: 'Pandion', eb: 'EB-812956340', card: '2206', init: 'F', initColor: '#8B5CF6' },
  { id: 'lily', name: 'Lily G.', tier: 'Silver', eb: 'EB-309284751', card: '4488', init: 'Li', initColor: '#A8B0BA' },
  { id: 'david', name: 'David B.', tier: 'Member', eb: 'EB-156723890', card: '3317', init: 'D', initColor: '#F97316' },
]

/* ─── Organizer ─── */
const ORGANIZER = { name: 'Luca G.', tier: 'Gold', eb: 'EB-445129038', card: '7834', init: 'L', initColor: '#D4A843' }

/* ─── SAS Logo ─── */
const SASLogo = ({ size = 24, color = C.white }) => (
  <span style={{ fontSize: size, fontWeight: 700, fontStyle: 'italic', color, letterSpacing: -0.5, fontFamily: "'DM Sans', sans-serif" }}>
    SAS
  </span>
)

/* ─── Bottom Nav Bar ─── */
const BottomNav = ({ activeTab = 'book' }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: null, isSAS: true },
    { id: 'trips', label: 'My trips', icon: Plane },
    { id: 'book', label: 'Book', icon: Search },
    { id: 'me', label: 'Me', icon: User },
    { id: 'more', label: 'More', icon: Menu },
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: 60, background: C.bg, borderTop: '1px solid rgba(255,255,255,0.06)', paddingBottom: 4, flexShrink: 0 }}>
      {tabs.map(t => {
        const active = t.id === activeTab
        const color = active ? C.blue : C.greyLight
        return (
          <div key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'default' }}>
            {t.isSAS ? <SASLogo size={16} color={color} /> : <t.icon size={20} color={color} />}
            <span style={{ fontSize: 10, color, fontWeight: active ? 600 : 400 }}>{t.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Status Bar ─── */
const StatusBar = () => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 20px 4px', height: 44, flexShrink: 0 }}>
    <span style={{ fontSize: 15, fontWeight: 600, color: C.white }}>17:23</span>
    <div style={{ width: 80, height: 28, borderRadius: 20, background: 'rgba(0,0,0,0.3)', position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0 }} />
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
        {[8, 10, 12, 14].map((h, i) => <div key={i} style={{ width: 3, height: h, background: C.white, borderRadius: 1 }} />)}
      </div>
      <svg width="15" height="11" viewBox="0 0 15 11" fill="none"><path d="M7.5 2.5C9.5 2.5 11.3 3.3 12.6 4.6L14 3.2C12.3 1.5 10 0.5 7.5 0.5C5 0.5 2.7 1.5 1 3.2L2.4 4.6C3.7 3.3 5.5 2.5 7.5 2.5Z" fill="white"/><path d="M7.5 5.5C8.7 5.5 9.8 6 10.6 6.8L12 5.4C10.8 4.2 9.2 3.5 7.5 3.5C5.8 3.5 4.2 4.2 3 5.4L4.4 6.8C5.2 6 6.3 5.5 7.5 5.5Z" fill="white"/><circle cx="7.5" cy="9.5" r="1.5" fill="white"/></svg>
      <div style={{ width: 25, height: 11, border: '1px solid rgba(255,255,255,0.5)', borderRadius: 3, padding: 1, position: 'relative' }}>
        <div style={{ width: '72%', height: '100%', background: C.white, borderRadius: 1.5 }} />
        <div style={{ position: 'absolute', right: -3, top: 3, width: 2, height: 5, background: 'rgba(255,255,255,0.5)', borderRadius: '0 1px 1px 0' }} />
      </div>
    </div>
  </div>
)

/* ─── Home Indicator ─── */
const HomeIndicator = () => (
  <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 6, paddingTop: 2, flexShrink: 0 }}>
    <div style={{ width: 134, height: 5, background: 'rgba(255,255,255,0.2)', borderRadius: 3 }} />
  </div>
)

/* ─── Tier Badge ─── */
const TierBadge = ({ tier }) => {
  const cfg = {
    Gold: { color: '#D4A843', border: 'rgba(212,168,67,0.3)' },
    Silver: { color: '#C5CCD6', border: 'rgba(197,204,214,0.35)' },
    Member: { color: C.greyLight, border: 'rgba(107,114,128,0.2)' },
    Pandion: { color: 'rgba(255,255,255,0.35)', bright: 'rgba(255,255,255,0.85)', border: 'rgba(255,255,255,0.22)' },
  }
  const c = cfg[tier] || cfg.Member
  if (tier === 'Pandion') {
    return (
      <span style={{
        border: `1px solid ${c.border}`,
        padding: '1px 1px 1px 7px', borderRadius: 4, marginLeft: 6,
        display: 'inline-flex', gap: 0,
      }}>
        {'Pandion'.split('').map((ch, i) => (
          <span key={i} style={{
            fontSize: 10, fontWeight: 500, letterSpacing: 0.3,
            color: c.color,
            animation: `pandionGlow 3s ease-in-out ${i * 0.18}s infinite`,
            paddingRight: i === 6 ? 6 : 0,
          }}>{ch}</span>
        ))}
      </span>
    )
  }
  return (
    <span style={{
      fontSize: 10, fontWeight: 500, color: c.color,
      border: `1px solid ${c.border}`,
      padding: '1px 7px', borderRadius: 4, marginLeft: 6,
      letterSpacing: 0.3,
    }}>
      {tier}
    </span>
  )
}

/* ─── Progress Dots ─── */
const ProgressDots = ({ current, total }) => (
  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '12px 0' }}>
    {Array.from({ length: total }, (_, i) => (
      <div key={i} style={{
        width: i === current ? 20 : 8, height: 8, borderRadius: 4,
        background: i === current ? C.blue : 'rgba(255,255,255,0.15)',
        transition: 'all 0.3s ease'
      }} />
    ))}
  </div>
)

/* ─── All 6 people (organizer + invitees) for shared UI ─── */
const ALL_PEOPLE = [
  { ...ORGANIZER },
  ...ALL_MEMBERS.map(m => ({ ...m })),
]

/* ══════════════════════════════════════════════════════════════════
   SCREEN 1: Flight Search Results
   ══════════════════════════════════════════════════════════════════ */
const Screen1 = () => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
    {/* Header toggle */}
    <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeInUp 0.3s ease' }}>
      <div style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(43,107,242,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ArrowLeft size={18} color={C.blue} />
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', background: C.card, borderRadius: 24, overflow: 'hidden' }}>
          <div style={{ padding: '8px 20px', background: C.blue, borderRadius: 24, color: C.white, fontSize: 13, fontWeight: 600 }}>Departure flight</div>
          <div style={{ padding: '8px 20px', color: C.greyLight, fontSize: 13, fontWeight: 500 }}>Return flight</div>
        </div>
      </div>
    </div>

    {/* Route card */}
    <div style={{ margin: '8px 20px', padding: '16px 20px', background: C.card, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'fadeInUp 0.35s ease' }}>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: 11, color: C.grey, marginBottom: 2 }}>From</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: C.white }}>ARN</div>
        <div style={{ fontSize: 12, color: C.grey }}>Arlanda</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.15)' }} />
        <Plane size={16} color={C.grey} />
        <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.15)' }} />
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 11, color: C.grey, marginBottom: 2 }}>To</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: C.white }}>BCN</div>
        <div style={{ fontSize: 12, color: C.grey }}>Barcelona</div>
      </div>
    </div>

    {/* Date selector */}
    <div style={{ display: 'flex', padding: '4px 20px 12px', animation: 'fadeInUp 0.4s ease' }}>
      {[
        { day: 'Fri, 14 Mar', price: '1,690 SEK', active: false },
        { day: 'Sat, 15 Mar', price: '1,840 SEK', active: true },
        { day: 'Sun, 16 Mar', price: '2,120 SEK', active: false },
      ].map((d, i) => (
        <div key={i} style={{ flex: 1, textAlign: 'center', padding: '10px 8px', borderBottom: d.active ? '2px solid white' : '2px solid transparent' }}>
          <div style={{ fontSize: 12, fontWeight: d.active ? 600 : 400, color: d.active ? C.white : C.greyLight }}>{d.day}</div>
          <div style={{ fontSize: 12, fontWeight: d.active ? 600 : 400, color: d.active ? C.white : C.greyLight, marginTop: 2 }}>{d.price}</div>
        </div>
      ))}
    </div>

    {/* Flight cards */}
    <div style={{ flex: 1, overflow: 'auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[
        { dep: '08:40', arr: '12:15', dur: '3h 35 min', price: '1,840', seats: null, selected: true },
        { dep: '14:20', arr: '17:55', dur: '3h 35 min', price: '2,290', seats: '4 seats left', selected: false },
      ].map((f, i) => (
        <div key={i} style={{
          background: C.card, borderRadius: 16, padding: '18px 18px 14px',
          animation: `fadeInUp ${0.45 + i * 0.1}s ease`,
          border: f.selected ? `1px solid ${C.blue}40` : '1px solid transparent',
          transition: 'border 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: C.white }}>{f.dep}</span>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', height: 2, background: C.blue, borderRadius: 1 }} />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: C.grey }}>Direct</span>
                <span style={{ fontSize: 11, color: C.greyLight }}>·</span>
                <span style={{ fontSize: 11, color: C.grey }}>{f.dur}</span>
              </div>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: C.white }}>{f.arr}</span>
          </div>
          <div style={{ height: 8 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: C.grey }}>ARN</span>
            <span style={{ fontSize: 13, color: C.grey }}>BCN</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: 'rgba(43,107,242,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Info size={12} color={C.blue} />
              </div>
              {f.seats && (
                <span style={{ fontSize: 11, fontWeight: 600, color: '#991B1B', background: C.coral, padding: '3px 10px', borderRadius: 20 }}>{f.seats}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div>
                <span style={{ fontSize: 14, color: C.grey }}>From </span>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.white }}>{f.price}</span>
                <span style={{ fontSize: 14, color: C.grey }}> SEK</span>
              </div>
              {f.selected && <ChevronRight size={16} color={C.blue} />}
            </div>
          </div>
        </div>
      ))}
      <div style={{ height: 16 }} />
    </div>
  </div>
)

/* ══════════════════════════════════════════════════════════════════
   SCREEN 1b: Selected Flight — Book as Group CTA
   ══════════════════════════════════════════════════════════════════ */
const Screen1b = ({ onBookAsGroup }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
    {/* Header */}
    <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeInUp 0.3s ease' }}>
      <div style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(43,107,242,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ArrowLeft size={18} color={C.blue} />
      </div>
      <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color: C.white, textAlign: 'center' }}>Your flight</span>
      <div style={{ width: 36 }} />
    </div>

    {/* Selected flight detail */}
    <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: C.card, borderRadius: 16, padding: '20px 18px', animation: 'fadeInUp 0.35s ease', border: `1px solid ${C.blue}30` }}>
        <div style={{ fontSize: 13, color: C.grey, marginBottom: 10 }}>SK1423 · Direct · Sat, Mar 15</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.white }}>08:40</div>
            <div style={{ fontSize: 13, color: C.grey }}>ARN · Arlanda</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 1, background: 'rgba(255,255,255,0.15)' }} />
            <Plane size={16} color={C.blue} />
            <div style={{ width: 30, height: 1, background: 'rgba(255,255,255,0.15)' }} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.white }}>12:15</div>
            <div style={{ fontSize: 13, color: C.grey }}>BCN · Barcelona</div>
          </div>
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0 12px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: C.grey }}>SAS Go</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: C.white }}>1,840 <span style={{ fontSize: 14, fontWeight: 400, color: C.grey }}>SEK</span></span>
        </div>
      </div>

      {/* Organizer info */}
      <div style={{ background: C.card, borderRadius: 14, padding: 16, animation: 'fadeInUp 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: `${ORGANIZER.initColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: ORGANIZER.initColor }}>{ORGANIZER.init}</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.white }}>{ORGANIZER.name}</span>
              <TierBadge tier={ORGANIZER.tier} />
            </div>
            <div style={{ fontSize: 12, color: C.grey, marginTop: 1 }}>{ORGANIZER.eb}</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 500, color: C.blue, background: `${C.blue}18`, padding: '3px 10px', borderRadius: 8, marginLeft: 'auto' }}>You</span>
        </div>
      </div>

      <div style={{ flex: 1 }} />
    </div>

    {/* Action buttons */}
    <div style={{ padding: '12px 20px 16px', display: 'flex', flexDirection: 'column', gap: 10, animation: 'fadeInUp 0.5s ease' }}>
      <div
        style={{
          background: C.blue, borderRadius: 26, padding: '16px 0', textAlign: 'center',
          fontWeight: 600, fontSize: 16, color: C.white, cursor: 'default',
        }}
      >
        Continue booking
      </div>
      <div
        onClick={onBookAsGroup}
        style={{
          borderRadius: 26, padding: '14px 0', textAlign: 'center',
          fontWeight: 500, fontSize: 14, color: C.blue, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: `${C.blue}10`, border: `1px solid ${C.blue}30`,
          transition: 'transform 0.15s'
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <UserPlus size={16} color={C.blue} />
        Book as Group
      </div>
    </div>
  </div>
)

/* ══════════════════════════════════════════════════════════════════
   SCREEN 2: Invite EuroBonus Members (pre-populated)
   ══════════════════════════════════════════════════════════════════ */
const Screen2 = ({ onComplete }) => {
  const [addedMembers, setAddedMembers] = useState(ALL_MEMBERS)

  const handleRemove = (memberId) => {
    setAddedMembers(prev => prev.filter(m => m.id !== memberId))
  }

  const canContinue = addedMembers.length > 0

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
      {/* Header */}
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeInUp 0.3s ease' }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(43,107,242,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={18} color={C.blue} />
        </div>
        <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color: C.white, textAlign: 'center' }}>Your booking</span>
        <div style={{ width: 36 }} />
      </div>

      {/* Flight summary */}
      <div style={{ margin: '4px 20px 16px', padding: '14px 16px', background: C.card, borderRadius: 14, animation: 'fadeInUp 0.35s ease' }}>
        <div style={{ fontSize: 13, color: C.grey, marginBottom: 6 }}>SK1423 · ARN → BCN · Sat, Mar 15</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.white }}>08:40</span>
            <div style={{ flex: 1, height: 2, background: C.blue, borderRadius: 1 }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: C.white }}>12:15</span>
          </div>
          <div style={{ fontSize: 11, color: C.grey, textAlign: 'center', marginTop: 4 }}>Direct</div>
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: C.grey }}>From <span style={{ fontWeight: 700, color: C.white }}>1,840</span> SEK /person</div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {/* Organizer card */}
        <div style={{ background: C.card, borderRadius: 14, padding: 16, animation: 'fadeInUp 0.4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: `${ORGANIZER.initColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: ORGANIZER.initColor }}>{ORGANIZER.init}</span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: C.white }}>{ORGANIZER.name}</span>
                  <TierBadge tier={ORGANIZER.tier} />
                </div>
                <div style={{ fontSize: 12, color: C.grey, marginTop: 1 }}>{ORGANIZER.eb}</div>
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: C.blue, background: `${C.blue}18`, padding: '3px 10px', borderRadius: 8 }}>You</span>
          </div>
        </div>

        {/* Invite section */}
        <div style={{ animation: 'fadeInUp 0.45s ease' }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 10, display: 'block' }}>
            EuroBonus members in group
          </label>

          {/* Added members list (pre-populated) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {addedMembers.map((m) => (
              <div key={m.id} style={{
                background: C.card, borderRadius: 12, padding: '12px 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                animation: 'fadeInUp 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 17, background: `${m.initColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: m.initColor }}>{m.init}</span>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{m.name}</span>
                      <TierBadge tier={m.tier} />
                    </div>
                    <div style={{ fontSize: 11, color: C.grey, marginTop: 1 }}>{m.eb}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={16} color={C.green} />
                  <div onClick={() => handleRemove(m.id)} style={{ cursor: 'pointer', padding: 4 }}>
                    <X size={14} color={C.greyLight} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info note */}
        <div style={{ fontSize: 12, color: C.grey, textAlign: 'center', padding: '4px 0' }}>
          Each person pays their own share. No one fronts the cost.
        </div>
      </div>

      {/* Continue button */}
      <div style={{ padding: '12px 20px 16px' }}>
        <div
          onClick={canContinue ? onComplete : undefined}
          style={{
            background: canContinue ? C.blue : C.disabled,
            borderRadius: 26, padding: '16px 0', textAlign: 'center',
            fontWeight: 600, fontSize: 16,
            color: canContinue ? C.white : 'rgba(255,255,255,0.3)',
            cursor: canContinue ? 'pointer' : 'default',
            transition: 'background 0.3s ease, color 0.3s ease'
          }}
        >
          {canContinue ? `Send Invites & Continue` : 'Add travelers to continue'}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   SCREEN 3: Waiting Room — interactive Send Reminder + Book All
   5/6 confirmed at start (Luca, Hector, Daniel, Lily, David)
   1 pending: Fritiof
   ══════════════════════════════════════════════════════════════════ */
const Screen3 = ({ onBookAll }) => {
  const [memberStates, setMemberStates] = useState({
    fritiof: 'pending',
  })
  const [justConfirmed, setJustConfirmed] = useState(null)

  const handleSendReminder = (memberId) => {
    if (memberStates[memberId] !== 'pending') return
    setMemberStates(prev => ({ ...prev, [memberId]: 'sending' }))
    setTimeout(() => {
      setMemberStates(prev => ({ ...prev, [memberId]: 'confirmed' }))
      setJustConfirmed(memberId)
      setTimeout(() => setJustConfirmed(null), 1000)
    }, 2500)
  }

  const confirmedCount = 5 + (memberStates.fritiof === 'confirmed' ? 1 : 0)
  const allConfirmed = confirmedCount === 6

  const members = [
    { id: null, name: ORGANIZER.name, tier: ORGANIZER.tier, card: ORGANIZER.card, init: ORGANIZER.init, initColor: ORGANIZER.initColor, method: 'Organizer', status: 'confirmed' },
    { id: null, name: 'Hector F.', tier: 'Silver', card: '4291', init: 'H', initColor: C.blue, method: 'EB Invite', status: 'confirmed' },
    { id: null, name: 'Daniel Å.', tier: 'Silver', card: '5519', init: 'D', initColor: '#10B981', method: 'EB Invite', status: 'confirmed' },
    { id: null, name: 'Lily G.', tier: 'Silver', card: '4488', init: 'Li', initColor: '#A8B0BA', method: 'EB Invite', status: 'confirmed' },
    { id: null, name: 'David B.', tier: 'Member', card: '3317', init: 'D', initColor: '#F97316', method: 'EB Invite', status: 'confirmed' },
    { id: 'fritiof', name: 'Fritiof H.', tier: 'Pandion', card: '2206', init: 'F', initColor: '#8B5CF6', method: 'EB Invite', status: memberStates.fritiof },
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(43,107,242,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={18} color={C.blue} />
        </div>
        <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color: C.white, textAlign: 'center' }}>Barcelona Trip</span>
        <Share2 size={18} color={C.blue} />
      </div>

      <div style={{ margin: '4px 20px 12px', padding: '12px 16px', background: C.card, borderRadius: 14 }}>
        <div style={{ fontSize: 13, color: C.grey, marginBottom: 4 }}>SK1423 · ARN → BCN · Sat, Mar 15</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.white }}>08:40</span>
            <div style={{ flex: 1, height: 2, background: C.blue, borderRadius: 1 }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: C.white }}>12:15</span>
          </div>
          <div style={{ fontSize: 11, color: C.grey, textAlign: 'center', marginTop: 4 }}>Direct</div>
        </div>
      </div>

      <div style={{ padding: '0 20px', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{confirmedCount} of 6 confirmed</span>
          <span style={{ fontSize: 12, color: allConfirmed ? C.green : C.grey }}>{allConfirmed ? 'Ready!' : 'Waiting...'}</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(confirmedCount / 6) * 100}%`, background: allConfirmed ? C.green : C.blue, borderRadius: 2, transition: 'width 0.5s ease, background 0.5s ease' }} />
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {members.map((m, i) => {
          const isJustConfirmed = justConfirmed === m.id
          return (
            <div key={i} style={{
              background: C.card, borderRadius: 14, padding: '12px 14px',
              border: m.status === 'sending' ? `1px solid rgba(43,107,242,0.2)` : '1px solid transparent',
              animation: isJustConfirmed ? 'pulse 0.5s ease' : 'none',
              transition: 'border 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 18, background: `${m.initColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${m.initColor}40` }}>
                    <span style={{ fontSize: m.init.length > 1 ? 12 : 15, fontWeight: 700, color: m.initColor }}>{m.init}</span>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{m.name}</span>
                      <TierBadge tier={m.tier} />
                    </div>
                    <div style={{ fontSize: 11, color: C.greyLight, marginTop: 1 }}>{m.method}</div>
                  </div>
                </div>
                <div>
                  {m.status === 'confirmed' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                          style={{
                            strokeDasharray: 24, strokeDashoffset: 0,
                            animation: isJustConfirmed ? 'checkDraw 0.5s ease forwards' : 'none'
                          }}
                        />
                      </svg>
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.green }}>Confirmed</span>
                    </div>
                  ) : m.status === 'sending' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {[0, 1, 2].map(j => (
                          <div key={j} style={{ width: 5, height: 5, borderRadius: 3, background: C.blue, animation: `dotPulse 1s ease-in-out ${j * 0.15}s infinite` }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 500, color: C.blue }}>Sending...</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={14} color={C.amber} />
                      <span style={{ fontSize: 11, fontWeight: 500, color: C.amber }}>Pending</span>
                    </div>
                  )}
                </div>
              </div>
              {m.status === 'confirmed' ? (
                <div style={{ marginTop: 6, fontSize: 11, color: C.greyLight,
                  animation: isJustConfirmed ? 'fadeIn 0.5s ease' : 'none'
                }}>
                  Card ending ····{m.card}
                </div>
              ) : m.status === 'sending' ? (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: C.blue, borderRadius: 2, animation: 'progressFill 2.5s ease forwards' }} />
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 6 }}>
                  <span
                    onClick={() => handleSendReminder(m.id)}
                    style={{ fontSize: 12, fontWeight: 500, color: C.blue, cursor: 'pointer' }}
                  >
                    Send Reminder
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ padding: '12px 20px' }}>
        <div
          onClick={allConfirmed ? onBookAll : undefined}
          style={{
            background: allConfirmed ? C.blue : C.disabled,
            borderRadius: 26, padding: '16px 0', textAlign: 'center',
            fontWeight: 600, fontSize: 16, color: allConfirmed ? C.white : 'rgba(255,255,255,0.4)',
            transition: 'background 0.5s ease, color 0.5s ease',
            animation: allConfirmed ? 'buttonGlow 2s ease infinite' : 'none',
            cursor: allConfirmed ? 'pointer' : 'default',
          }}
          onMouseDown={e => { if (allConfirmed) e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {allConfirmed ? 'Book All · 1,840 SEK each' : 'Waiting for all travelers to confirm'}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   BOOKING ANIMATION — premium transition after clicking Book All
   ══════════════════════════════════════════════════════════════════ */
const BookingAnimation = ({ onDone }) => {
  const canvasRef = useRef(null)
  const [showConfirmed, setShowConfirmed] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const startTimeRef = useRef(null)
  const rafRef = useRef(null)

  const people = [
    { init: 'L', color: '#D4A843' },
    { init: 'H', color: '#2B6BF2' },
    { init: 'D', color: '#10B981' },
    { init: 'F', color: '#8B5CF6' },
    { init: 'Li', color: '#A8B0BA' },
    { init: 'D', color: '#F97316' },
  ]

  /*
    Timeline (seconds):
    0.0 – 0.6   Fade in: avatars appear one by one in a circle
    0.6 – 2.0   Gentle orbit
    2.0 – 3.6   Accelerating spiral inward (speed ramps up, radius shrinks)
    3.6 – 3.7   Crescendo flash
    3.7 – 4.8   Confirmed state (plane + settled dots)
    4.8         → onDone
  */
  const TOTAL = 5.8
  const T_FADE_END = 0.6
  const T_ACCEL_START = 2.0
  const T_CONVERGE = 3.6
  const T_CONFIRMED = 3.7

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = 220, H = 220
    const cx = W / 2, cy = H / 2
    const dpr = window.devicePixelRatio || 1
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const drawAvatar = (x, y, size, person, opacity, glowStrength) => {
      ctx.save()
      ctx.globalAlpha = opacity

      // Glow
      if (glowStrength > 0) {
        ctx.shadowColor = person.color
        ctx.shadowBlur = glowStrength
      }

      // Circle fill
      ctx.beginPath()
      ctx.arc(x, y, size / 2, 0, Math.PI * 2)
      ctx.fillStyle = person.color + '25'
      ctx.fill()

      // Border
      ctx.strokeStyle = person.color + '70'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Text
      ctx.shadowBlur = 0
      ctx.fillStyle = person.color
      ctx.font = `700 ${size > 20 ? (person.init.length > 1 ? 10 : 13) : (person.init.length > 1 ? 7 : 9)}px 'DM Sans', sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      if (size > 8) ctx.fillText(person.init, x, y + 1)

      ctx.restore()
    }

    const drawTrail = (x, y, radius, color, opacity) => {
      ctx.save()
      ctx.globalAlpha = opacity * 0.3
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.restore()
    }

    const easeInCubic = t => t * t * t
    const easeOutQuad = t => 1 - (1 - t) * (1 - t)

    let angle = 0
    // Store trail positions
    const trails = []

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = (timestamp - startTimeRef.current) / 1000
      const t = Math.min(elapsed, TOTAL)

      ctx.clearRect(0, 0, W, H)

      // Calculate current rotation speed and radius
      let speed, radius, avatarSize
      if (t < T_FADE_END) {
        speed = 0
        radius = 72
        avatarSize = 34
      } else if (t < T_ACCEL_START) {
        // Gentle constant orbit
        speed = 0.6
        radius = 72
        avatarSize = 34
      } else if (t < T_CONVERGE) {
        // Accelerate and spiral in
        const p = (t - T_ACCEL_START) / (T_CONVERGE - T_ACCEL_START)
        const accelCurve = easeInCubic(p)
        speed = 0.6 + accelCurve * 12
        radius = 72 * (1 - easeInCubic(p))
        avatarSize = 34 * (1 - p * 0.85)
      } else {
        speed = 0
        radius = 0
        avatarSize = 0
      }

      // Update angle
      angle += speed * (1 / 60)

      // Draw orbit track (faint)
      if (t >= T_FADE_END && t < T_CONVERGE) {
        const trackOpacity = t < T_ACCEL_START ? 0.06 : 0.06 * (1 - (t - T_ACCEL_START) / (T_CONVERGE - T_ACCEL_START))
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(43,107,242,${trackOpacity})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw connecting lines between adjacent avatars
      if (t >= T_FADE_END && t < T_CONVERGE && radius > 10) {
        const lineOpacity = Math.min(0.15, radius > 40 ? 0.15 : (radius / 40) * 0.15)
        for (let i = 0; i < 6; i++) {
          const a1 = angle + (i * 60 - 90) * (Math.PI / 180)
          const a2 = angle + ((i + 1) * 60 - 90) * (Math.PI / 180)
          const x1 = cx + Math.cos(a1) * radius
          const y1 = cy + Math.sin(a1) * radius
          const x2 = cx + Math.cos(a2) * radius
          const y2 = cy + Math.sin(a2) * radius
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.strokeStyle = `rgba(43,107,242,${lineOpacity})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // Draw trails during spiral phase
      if (t >= T_ACCEL_START && t < T_CONVERGE) {
        for (let i = 0; i < 6; i++) {
          const a = angle + (i * 60 - 90) * (Math.PI / 180)
          const x = cx + Math.cos(a) * radius
          const y = cy + Math.sin(a) * radius
          trails.push({ x, y, color: people[i].color, birth: t, size: avatarSize * 0.3 })
        }
      }

      // Render and age trails
      for (let i = trails.length - 1; i >= 0; i--) {
        const trail = trails[i]
        const age = t - trail.birth
        const opacity = Math.max(0, 1 - age / 0.5)
        if (opacity <= 0) { trails.splice(i, 1); continue }
        drawTrail(trail.x, trail.y, trail.size * opacity, trail.color, opacity)
      }

      // Draw center glow (builds as avatars approach)
      if (t >= T_ACCEL_START && t < T_CONFIRMED) {
        const p = Math.min(1, (t - T_ACCEL_START) / (T_CONVERGE - T_ACCEL_START))
        const glowSize = 15 + p * 40
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize)
        gradient.addColorStop(0, `rgba(43,107,242,${0.1 + p * 0.25})`)
        gradient.addColorStop(1, 'rgba(43,107,242,0)')
        ctx.beginPath()
        ctx.arc(cx, cy, glowSize, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Draw avatars
      if (t < T_CONVERGE) {
        for (let i = 0; i < 6; i++) {
          const baseAngle = (i * 60 - 90) * (Math.PI / 180)
          const a = angle + baseAngle
          const x = cx + Math.cos(a) * radius
          const y = cy + Math.sin(a) * radius

          // Fade in stagger
          let opacity = 1
          if (t < T_FADE_END) {
            const fadeStart = i * 0.08
            opacity = Math.max(0, Math.min(1, (t - fadeStart) / 0.3))
          }

          // Glow increases during spiral
          const glowStrength = t >= T_ACCEL_START
            ? easeInCubic((t - T_ACCEL_START) / (T_CONVERGE - T_ACCEL_START)) * 16
            : 0

          drawAvatar(x, y, avatarSize, people[i], opacity, glowStrength)
        }
      }

      // Crescendo: ripple rings
      if (t >= T_CONVERGE && t < T_CONFIRMED + 1) {
        const since = t - T_CONVERGE
        for (let i = 0; i < 3; i++) {
          const ringT = since - i * 0.12
          if (ringT < 0 || ringT > 0.8) continue
          const ringP = ringT / 0.8
          const ringR = easeOutQuad(ringP) * 100
          const ringOpacity = (1 - ringP) * 0.5
          ctx.beginPath()
          ctx.arc(cx, cy, ringR, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(43,107,242,${ringOpacity})`
          ctx.lineWidth = 2 - ringP
          ctx.stroke()
        }
      }

      // Crescendo: particle burst
      if (t >= T_CONVERGE && t < T_CONVERGE + 1) {
        const since = t - T_CONVERGE
        for (let i = 0; i < 18; i++) {
          const pAngle = (i * 20) * (Math.PI / 180)
          const pDist = (80 + (i % 3) * 30) * easeOutQuad(Math.min(1, since / 0.7))
          const px = cx + Math.cos(pAngle) * pDist
          const py = cy + Math.sin(pAngle) * pDist
          const pOpacity = Math.max(0, 1 - since / 0.7)
          const pSize = (2 + (i % 2)) * (1 - since / 0.7)
          ctx.save()
          ctx.globalAlpha = pOpacity * 0.8
          ctx.beginPath()
          ctx.arc(px, py, pSize, 0, Math.PI * 2)
          ctx.fillStyle = people[i % 6].color
          ctx.fill()
          ctx.restore()
        }
      }

      // Confirmed state: plane glow + settled dots
      if (t >= T_CONFIRMED) {
        const confirmP = Math.min(1, (t - T_CONFIRMED) / 0.4)
        // Center glow settles
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 35)
        gradient.addColorStop(0, `rgba(43,107,242,${0.2 * confirmP})`)
        gradient.addColorStop(1, 'rgba(43,107,242,0)')
        ctx.beginPath()
        ctx.arc(cx, cy, 35, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Settled ring
        const ringScale = 0.5 + confirmP * 0.5
        ctx.beginPath()
        ctx.arc(cx, cy, 44 * ringScale, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(43,107,242,${0.15 * confirmP})`
        ctx.lineWidth = 1
        ctx.stroke()

        // Small settled dots
        for (let i = 0; i < 6; i++) {
          const dotDelay = i * 0.05
          const dotP = Math.max(0, Math.min(1, (t - T_CONFIRMED - dotDelay) / 0.25))
          if (dotP <= 0) continue
          const da = (i * 60 - 90) * (Math.PI / 180)
          const dx = cx + Math.cos(da) * 44
          const dy = cy + Math.sin(da) * 44
          ctx.save()
          ctx.globalAlpha = dotP
          ctx.shadowColor = people[i].color
          ctx.shadowBlur = 6
          ctx.beginPath()
          ctx.arc(dx, dy, 4 * dotP, 0, Math.PI * 2)
          ctx.fillStyle = people[i].color
          ctx.fill()
          ctx.restore()
        }
      }

      if (t < TOTAL) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    // Trigger flash
    const flashTimer = setTimeout(() => setShowFlash(true), T_CONVERGE * 1000)
    const flashOffTimer = setTimeout(() => setShowFlash(false), (T_CONVERGE + 0.6) * 1000)
    // Trigger confirmed text
    const confirmTimer = setTimeout(() => setShowConfirmed(true), T_CONFIRMED * 1000)
    // Done
    const doneTimer = setTimeout(onDone, TOTAL * 1000)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      clearTimeout(flashTimer)
      clearTimeout(flashOffTimer)
      clearTimeout(confirmTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20, background: C.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.3s ease', overflow: 'hidden',
    }}>
      {/* Flash overlay */}
      {showFlash && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none',
          background: `radial-gradient(circle at 50% 42%, rgba(43,107,242,0.2) 0%, transparent 55%)`,
          animation: 'bookingFlash 0.6s ease-out forwards',
        }} />
      )}

      {/* Canvas for smooth animation */}
      <canvas
        ref={canvasRef}
        style={{ width: 220, height: 220, marginBottom: 24 }}
      />

      {/* Text */}
      <div style={{
        fontSize: 18, fontWeight: 600, color: C.white, marginBottom: 6,
        opacity: showFlash ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }}>
        {showConfirmed ? 'Seats secured!' : 'Booking 6 seats together...'}
      </div>
      <div style={{ fontSize: 13, color: C.grey, marginBottom: 28 }}>
        SK1423 · ARN → BCN
      </div>

      {/* Progress bar */}
      <div style={{ width: 200, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2,
          background: C.blue,
          animation: `progressFill ${TOTAL}s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
        }} />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   SCREEN 4: David's View (interactive Biofuel toggle)
   ══════════════════════════════════════════════════════════════════ */
const Screen4 = ({ showConfirmed, onConfirm }) => {
  const [safEnabled, setSafEnabled] = useState(false)

  const groupAvatars = [
    { init: 'L', color: '#D4A843', done: true },
    { init: 'H', color: C.blue, done: false },
    { init: 'D', color: '#10B981', done: false },
    { init: 'F', color: '#8B5CF6', done: false },
    { init: 'Li', color: '#A8B0BA', done: false },
    { init: 'D', color: '#F97316', done: true },
  ]

  if (showConfirmed) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', animation: 'fadeIn 0.5s ease' }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, background: `${C.green}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 24, strokeDashoffset: 24, animation: 'checkDraw 0.6s ease 0.2s forwards' }}
            />
          </svg>
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.white, marginBottom: 8 }}>You're in!</div>
        <div style={{ fontSize: 14, color: C.grey, textAlign: 'center' }}>Waiting for 4 more travelers to confirm</div>
        <div style={{ marginTop: 24, display: 'flex', gap: 6 }}>
          {groupAvatars.map((a, i) => (
            <div key={i} style={{ width: 40, height: 40, borderRadius: 20, background: a.done ? `${a.color}20` : 'rgba(255,255,255,0.05)', border: `2px solid ${a.done ? a.color : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: a.init.length > 1 ? 12 : 15, fontWeight: 700, color: a.done ? a.color : C.greyLight }}>{a.init}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeInUp 0.3s ease' }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(43,107,242,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={18} color={C.blue} />
        </div>
        <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color: C.white, textAlign: 'center' }}>Flight Invitation</span>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeInUp 0.35s ease' }}>
        <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
          <div style={{ width: 60, height: 60, borderRadius: 30, background: `${C.blue}20`, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Send size={24} color={C.blue} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.white }}>You're invited!</div>
          <div style={{ fontSize: 14, color: C.grey, marginTop: 6 }}>{ORGANIZER.name} invited you to fly together</div>
        </div>

        <div style={{ background: C.card, borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 13, color: C.grey, marginBottom: 6 }}>SK1423 · ARN → BCN · Sat, Mar 15</div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: C.white }}>08:40</span>
              <div style={{ flex: 1, height: 2, background: C.blue, borderRadius: 1 }} />
              <span style={{ fontSize: 18, fontWeight: 700, color: C.white }}>12:15</span>
            </div>
            <div style={{ fontSize: 11, color: C.grey, textAlign: 'center', marginTop: 4 }}>Direct</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: C.grey }}>Your share</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: C.white }}>
              {safEnabled ? '1,940' : '1,840'} <span style={{ fontSize: 14, fontWeight: 400, color: C.grey }}>SEK</span>
            </span>
          </div>
        </div>

        <div style={{ background: C.card, borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 10 }}>Group</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {groupAvatars.map((a, i) => (
              <div key={i} style={{ width: 32, height: 32, borderRadius: 16, background: `${a.color}20`, border: `2px solid ${a.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: a.init.length > 1 ? 10 : 13, fontWeight: 700, color: a.color }}>{a.init}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: C.grey, marginTop: 8 }}>6 travelers · Luca, Hector, Daniel, Fritiof, Lily, David</div>
        </div>

        <div style={{ background: C.card, borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 10 }}>Payment method</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <CreditCard size={20} color={C.grey} />
            <div>
              <div style={{ fontSize: 14, color: C.white }}>Nordea Visa</div>
              <div style={{ fontSize: 12, color: C.greyLight }}>····3317</div>
            </div>
            <Check size={16} color={C.green} style={{ marginLeft: 'auto' }} />
          </div>
        </div>

        {/* Biofuel toggle — interactive */}
        <div
          onClick={() => setSafEnabled(prev => !prev)}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0', cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            border: safEnabled ? 'none' : '2px solid rgba(255,255,255,0.2)',
            background: safEnabled ? C.blue : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}>
            {safEnabled && <Check size={14} color={C.white} strokeWidth={3} />}
          </div>
          <div>
            <span style={{ fontSize: 13, color: C.white }}>Add Biofuel</span>
            <span style={{ fontSize: 13, color: C.grey }}> (+100 SEK)</span>
          </div>
        </div>

        <div style={{ paddingBottom: 16 }}>
          <div
            onClick={onConfirm}
            style={{
              background: C.blue, borderRadius: 26, padding: '16px 0', textAlign: 'center',
              cursor: 'pointer', fontWeight: 600, fontSize: 16, color: C.white,
              transition: 'transform 0.15s'
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Confirm & Join
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   SCREEN 5: Booking Confirmation — 6-seat row, enhanced seat map
   ══════════════════════════════════════════════════════════════════ */
const Screen5 = () => {
  const totalRows = 18
  const groupRow = 13
  const groupSeatCols = [0, 1, 2, 3, 4, 5]
  const seatLabels = { 0: 'L', 1: 'H', 2: 'D', 3: 'F', 4: 'Li', 5: 'D' }
  // Staged animation timings (seconds)
  const seatBaseDelay = 0.4
  const seatRowDelay = 0.03
  const pauseAt = seatBaseDelay + totalRows * seatRowDelay + 0.4
  const highlightStagger = 0.25

  const renderSeat = (row, seat) => {
    const isGroup = row === groupRow && groupSeatCols.includes(seat)
    const gIdx = groupSeatCols.indexOf(seat)
    const greyDelay = `${seatBaseDelay + row * seatRowDelay}s`
    const highlightDelay = `${pauseAt + gIdx * highlightStagger}s`

    if (isGroup) {
      return (
        <div key={seat} style={{
          width: 18, height: 16, borderRadius: 3, margin: '0 1.5px',
          background: 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 7, fontWeight: 700, color: C.white,
          animation: `seatReveal 0.2s ease ${greyDelay} both, seatHighlight 0.5s ease ${highlightDelay} forwards, glowPulse 0.8s ease ${highlightDelay} both`,
          position: 'relative',
        }}>
          <span style={{
            opacity: 0, animation: `fadeIn 0.3s ease ${parseFloat(highlightDelay) + 0.15}s forwards`,
            fontSize: seatLabels[seat].length > 1 ? 6 : 8, fontWeight: 700
          }}>
            {seatLabels[seat]}
          </span>
        </div>
      )
    }
    return (
      <div key={seat} style={{
        width: 18, height: 16, borderRadius: 3, margin: '0 1.5px',
        background: 'rgba(255,255,255,0.06)',
        animation: `seatReveal 0.2s ease ${greyDelay} both`,
      }} />
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={{ textAlign: 'center', padding: '24px 20px 16px', animation: 'fadeInUp 0.4s ease' }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, background: `${C.green}18`, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 24, strokeDashoffset: 24, animation: 'checkDraw 0.6s ease 0.3s forwards' }}
            />
          </svg>
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.white }}>Your group is booked</div>
        <div style={{ fontSize: 13, color: C.grey, marginTop: 6 }}>SK1423 · ARN → BCN · Sat, Mar 15 · 08:40–12:15</div>
      </div>

      {/* Seat map — staged reveal */}
      <div style={{ padding: '0 20px 12px', animation: 'fadeInUp 0.5s ease' }}>
        <div style={{ background: C.card, borderRadius: 16, padding: '20px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 14, textAlign: 'center' }}>Your seats</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            {Array.from({ length: totalRows }, (_, row) => (
              <div key={row} style={{ display: 'flex', alignItems: 'center' }}>
                {[0, 1, 2].map(seat => renderSeat(row, seat))}
                <div style={{ width: 14 }} />
                {[3, 4, 5].map(seat => renderSeat(row, seat))}
              </div>
            ))}
          </div>
          <div style={{
            textAlign: 'center', marginTop: 12, fontSize: 12, color: C.grey,
            opacity: 0,
            animation: `fadeInUp 0.4s ease ${pauseAt + 6 * highlightStagger + 0.3}s forwards`
          }}>
            Row 14 · Full row · Seated together
          </div>
        </div>
      </div>

      {/* Cost breakdown */}
      <div style={{ padding: '0 20px 12px', animation: 'fadeInUp 0.6s ease' }}>
        <div style={{ background: C.card, borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 12 }}>1,840 SEK charged to each traveler</div>
          {[
            { name: ORGANIZER.name, card: ORGANIZER.card },
            { name: 'Hector F.', card: '4291' },
            { name: 'Daniel Å.', card: '5519' },
            { name: 'Fritiof H.', card: '2206' },
            { name: 'Lily G.', card: '4488' },
            { name: 'David B.', card: '3317' },
          ].map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ fontSize: 12, color: C.grey }}>
                {p.name} <span style={{ color: C.greyLight }}>····{p.card}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.white }}>1,840 SEK</span>
                <Check size={12} color={C.green} />
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.white }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.white }}>11,040 SEK</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ background: C.blue, borderRadius: 26, padding: '14px 0', textAlign: 'center', fontWeight: 600, fontSize: 15, color: C.white }}>
          Share confirmation with group
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   SCREEN BIOFUEL: Biofuel Bonus — collective Biofuel adoption
   ══════════════════════════════════════════════════════════════════ */
const ScreenBiofuel = ({ onDone }) => {
  const [safStates, setSafStates] = useState({
    luca: true,
    hector: true,
    daniel: true,
    fritiof: false,
    lily: true,
    david: true,
  })
  const [sendingId, setSendingId] = useState(null)
  const [justAdded, setJustAdded] = useState(null)
  const [bonusUnlocked, setBonusUnlocked] = useState(false)

  const members = [
    { id: 'luca', name: ORGANIZER.name, init: ORGANIZER.init, initColor: ORGANIZER.initColor, hasSaf: safStates.luca },
    { id: 'hector', name: 'Hector F.', init: 'H', initColor: C.blue, hasSaf: safStates.hector },
    { id: 'daniel', name: 'Daniel Å.', init: 'D', initColor: '#10B981', hasSaf: safStates.daniel },
    { id: 'fritiof', name: 'Fritiof H.', init: 'F', initColor: '#8B5CF6', hasSaf: safStates.fritiof },
    { id: 'lily', name: 'Lily G.', init: 'Li', initColor: '#A8B0BA', hasSaf: safStates.lily },
    { id: 'david', name: 'David B.', init: 'D', initColor: '#F97316', hasSaf: safStates.david },
  ]

  const safCount = members.filter(m => m.hasSaf).length
  const allIn = safCount === 6
  const individualPoints = 300 // per person who adds Biofuel
  const collectiveBonus = allIn ? Math.round(individualPoints * 0.1) : 0 // 10% of individual
  const totalPerPerson = individualPoints + collectiveBonus

  const handleInvite = (memberId) => {
    if (sendingId || safStates[memberId]) return
    setSendingId(memberId)
    setTimeout(() => {
      setSafStates(prev => ({ ...prev, [memberId]: true }))
      setSendingId(null)
      setJustAdded(memberId)

      // Check if this completes the set (this member is the last)
      const newCount = members.filter(m => m.hasSaf || m.id === memberId).length
      if (newCount === 6) {
        setTimeout(() => setBonusUnlocked(true), 400)
      }

      setTimeout(() => setJustAdded(null), 1200)
    }, 2000)
  }

  // SVG ring dimensions
  const ringSize = 120
  const strokeWidth = 8
  const radius = (ringSize - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const ringOffset = circumference - (safCount / 6) * circumference

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
      {/* Header */}
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeInUp 0.3s ease' }}>
        <div
          onClick={onDone}
          style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(43,107,242,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <ArrowLeft size={18} color={C.blue} />
        </div>
        <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color: C.white, textAlign: 'center' }}>Biofuel Bonus</span>
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Fuel size={18} color={C.blue} />
        </div>
      </div>

      {/* Progress ring */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 20px 20px', animation: 'fadeInUp 0.4s ease' }}>
        <div style={{ position: 'relative', width: ringSize, height: ringSize, marginBottom: 12 }}>
          <svg width={ringSize} height={ringSize} style={{ transform: 'rotate(-90deg)' }}>
            {/* Background ring */}
            <circle
              cx={ringSize / 2} cy={ringSize / 2} r={radius}
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth}
            />
            {/* Progress ring */}
            <circle
              cx={ringSize / 2} cy={ringSize / 2} r={radius}
              fill="none" stroke={C.blue} strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={ringOffset}
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          {/* Center text */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: C.white }}>
              {safCount}
            </span>
            <span style={{ fontSize: 11, color: C.grey }}>of 6</span>
          </div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.white, textAlign: 'center' }}>
          {allIn ? 'All members added Biofuel' : 'Members with Biofuel'}
        </div>
        <div style={{ fontSize: 12, color: C.grey, marginTop: 4, textAlign: 'center' }}>
          Biofuel · 100 SEK per booking
        </div>
      </div>

      {/* Points card */}
      <div style={{ padding: '0 20px 12px', animation: 'fadeInUp 0.5s ease' }}>
        <div style={{
          background: C.card, borderRadius: 16, padding: 16,
          border: allIn ? `1px solid ${C.blue}40` : '1px solid transparent',
          animation: bonusUnlocked ? 'celebrationPulse 0.8s ease' : 'none',
          transition: 'border 0.5s ease'
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 12 }}>EuroBonus Level Points</div>

          {/* Individual points */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Fuel size={14} color={C.blue} />
              <span style={{ fontSize: 13, color: C.grey }}>Biofuel contributions ({safCount}×{individualPoints})</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.blue }}>+{safCount * individualPoints}</span>
          </div>

          {/* Collective bonus */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 12px', borderRadius: 12, marginBottom: 10,
            background: allIn ? `${C.blue}15` : 'rgba(255,255,255,0.03)',
            transition: 'background 0.5s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {allIn ? (
                <div style={{ animation: bonusUnlocked ? 'unlockBounce 0.6s ease' : 'none' }}>
                  <Unlock size={14} color={C.blue} />
                </div>
              ) : (
                <Lock size={14} color={C.greyLight} />
              )}
              <div>
                <span style={{ fontSize: 13, color: allIn ? C.white : C.greyLight }}>Group bonus (10%)</span>
                {!allIn && (
                  <div style={{ fontSize: 11, color: C.greyLight, marginTop: 1 }}>
                    Unlocks when all 6 add Biofuel
                  </div>
                )}
              </div>
            </div>
            <span style={{
              fontSize: 14, fontWeight: 700,
              color: allIn ? C.blue : C.greyLight,
              transition: 'color 0.5s ease',
              animation: bonusUnlocked ? 'countUp 0.5s ease 0.3s both' : 'none'
            }}>
              +{Math.round(individualPoints * 0.1)}
            </span>
          </div>

          {/* Divider + total */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.white }}>Per person</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.white }}>
              {allIn ? totalPerPerson : individualPoints} pts
            </span>
          </div>
        </div>
      </div>

      {/* Member list */}
      <div style={{ padding: '0 20px', flex: 1, animation: 'fadeInUp 0.55s ease' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 8 }}>Members</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {members.map((m) => {
            const isSending = sendingId === m.id
            const wasJustAdded = justAdded === m.id
            return (
              <div key={m.id} style={{
                background: C.card, borderRadius: 12, padding: '10px 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                border: isSending ? `1px solid ${C.blue}30` : '1px solid transparent',
                animation: wasJustAdded ? 'pulse 0.5s ease' : 'none',
                transition: 'border 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 16, background: `${m.initColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${m.initColor}40` }}>
                    <span style={{ fontSize: m.init.length > 1 ? 10 : 13, fontWeight: 700, color: m.initColor }}>{m.init}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: C.white }}>{m.name}</span>
                </div>
                <div>
                  {m.hasSaf ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Fuel size={12} color={C.blue} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.blue }}>+{individualPoints} pts</span>
                    </div>
                  ) : isSending ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {[0, 1, 2].map(j => (
                          <div key={j} style={{ width: 4, height: 4, borderRadius: 2, background: C.blue, animation: `dotPulse 1s ease-in-out ${j * 0.15}s infinite` }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 500, color: C.blue }}>Inviting...</span>
                    </div>
                  ) : (
                    <span
                      onClick={() => handleInvite(m.id)}
                      style={{ fontSize: 11, fontWeight: 500, color: C.blue, cursor: 'pointer' }}
                    >
                      Invite to add
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Continue button */}
      <div style={{ padding: '12px 20px 16px' }}>
        <div
          onClick={onDone}
          style={{
            background: C.blue, borderRadius: 26, padding: '14px 0',
            textAlign: 'center', fontWeight: 600, fontSize: 15, color: C.white,
            cursor: 'pointer'
          }}
        >
          Back to trip
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   SCREEN 6: Trip Card — with Biofuel Bonus + Luggage Calculator
   ══════════════════════════════════════════════════════════════════ */
const Screen6 = ({ onBiofuel }) => {
  const avatars = [
    { init: 'L', color: '#D4A843' },
    { init: 'H', color: C.blue },
    { init: 'D', color: '#10B981' },
    { init: 'F', color: '#8B5CF6' },
    { init: 'Li', color: '#A8B0BA' },
    { init: 'D', color: '#F97316' },
  ]
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
      <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'fadeInUp 0.3s ease' }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: C.white }}>My trips</span>
        <SASLogo size={20} />
      </div>

      <div style={{ padding: '0 20px', animation: 'fadeInUp 0.4s ease' }}>
        <div style={{
          background: `linear-gradient(135deg, ${C.card} 0%, #1A1A3A 50%, #1C2044 100%)`,
          borderRadius: 20, overflow: 'hidden', position: 'relative'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 100,
            background: 'linear-gradient(180deg, rgba(43,107,242,0.08) 0%, transparent 100%)',
            borderRadius: '20px 20px 0 0'
          }} />
          <div style={{ padding: '24px 20px', position: 'relative' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.white, marginBottom: 4 }}>Barcelona</div>
            <div style={{ fontSize: 14, color: C.grey, marginBottom: 16 }}>Sat, Mar 15, 2027</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Plane size={14} color={C.grey} />
              <span style={{ fontSize: 13, color: C.grey }}>SK1423 · 08:40–12:15 · Direct</span>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 16 }} />

            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                {avatars.map((a, i) => (
                  <div key={i} style={{
                    width: 38, height: 38, borderRadius: 19,
                    background: `${a.color}20`, border: `2px solid ${a.color}50`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: `fadeInUp ${0.5 + i * 0.1}s ease`
                  }}>
                    <span style={{ fontSize: a.init.length > 1 ? 11 : 15, fontWeight: 700, color: a.color }}>{a.init}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, color: C.grey }}>Luca, Hector, Daniel, Fritiof, Lily & David</div>
              <div style={{ fontSize: 12, color: C.greyLight, marginTop: 2 }}>Seats 14A–14F</div>
            </div>
          </div>
        </div>
      </div>

      {/* Group actions */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10, animation: 'fadeInUp 0.55s ease' }}>
        <div
          onClick={onBiofuel}
          style={{
            background: C.card, borderRadius: 14, padding: '16px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer', border: `1px solid ${C.blue}20`,
            transition: 'transform 0.15s'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: `${C.blue}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Fuel size={18} color={C.blue} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white }}>Biofuel Bonus</div>
              <div style={{ fontSize: 12, color: C.grey, marginTop: 1 }}>5 of 6 members · Earn level points</div>
            </div>
          </div>
          <ChevronRight size={16} color={C.greyLight} />
        </div>

        <div style={{
          background: C.card, borderRadius: 14, padding: '16px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'default'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.grey} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M16 7V5a4 4 0 0 0-8 0v2" />
                <circle cx="12" cy="15" r="1" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white }}>Luggage Calculator</div>
              <div style={{ fontSize: 12, color: C.grey, marginTop: 1 }}>Check group luggage allowance</div>
            </div>
          </div>
          <ChevronRight size={16} color={C.greyLight} />
        </div>
      </div>
    </div>
  )
}

/* ─── Perspective Switch Overlay ─── */
const PerspectiveSwitch = ({ name, onDone }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 1800)
    return () => clearTimeout(timer)
  }, [onDone])
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20, background: C.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{ width: 56, height: 56, borderRadius: 28, background: `${C.blue}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <User size={24} color={C.blue} />
      </div>
      <div style={{ fontSize: 14, color: C.grey, marginBottom: 6 }}>Switching view</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.white }}>{name}</div>
    </div>
  )
}

/* ─── Back-to-organizer Overlay ─── */
const BackToOrganizer = ({ onDone }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 1500)
    return () => clearTimeout(timer)
  }, [onDone])
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20, background: C.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{ width: 56, height: 56, borderRadius: 28, background: `${ORGANIZER.initColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <User size={24} color={ORGANIZER.initColor} />
      </div>
      <div style={{ fontSize: 14, color: C.grey, marginBottom: 6 }}>Back to organizer</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.white }}>{ORGANIZER.name}</div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN APP — state machine (revised flow)
   ══════════════════════════════════════════════════════════════════ */
function App() {
  /*
    Step map:
    0  → Screen 1   (Flight results)                     click-to-advance
    1  → Screen 1b  (Selected flight, "Book as Group")    INTERACTIVE
    2  → Screen 2   (Pre-populated group invite)          INTERACTIVE
    3  → Perspective switch to David                      auto-advance (1.8s)
    4  → Screen 4   (David's invitation, Biofuel toggle)  INTERACTIVE
    5  → Screen 4   confirmed state                       click-to-advance
    6  → Back to organizer                                auto-advance (1.5s)
    7  → Screen 3   (interactive reminders + Book All)    INTERACTIVE
    8  → Booking animation                                auto-advance (3.2s)
    9  → Screen 5   (confirmation + seat map)             click-to-advance
    10 → Screen 6   (trip card — interactive)             INTERACTIVE / END
    11 → ScreenBiofuel (sub-screen from trip card)        INTERACTIVE
  */
  const [step, setStep] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const totalScreens = 6
  // 0=Flight, 1=Invite, 2=David's View, 3=Waiting Room, 4=Confirmation, 5=Trip
  const screenIndex = step <= 1 ? 0 : step <= 2 ? 1 : step <= 5 ? 2 : step <= 7 ? 3 : step <= 9 ? 4 : 5

  const isInteractive = step === 1 || step === 2 || step === 4 || step === 7 || step === 10 || step === 11
  const isOverlay = step === 3 || step === 6 || step === 8

  const advance = useCallback(() => {
    if (transitioning) return
    if (step >= 10) return
    if (isInteractive) return

    const slideSteps = [0, 5, 9]
    const needsSlide = slideSteps.includes(step)

    if (needsSlide) {
      setTransitioning(true)
      setTimeout(() => {
        setStep(s => s + 1)
        setTransitioning(false)
      }, 250)
    } else {
      setStep(s => s + 1)
    }
  }, [step, transitioning, isInteractive])

  const handleBookAsGroup = useCallback(() => {
    setTransitioning(true)
    setTimeout(() => { setStep(2); setTransitioning(false) }, 250)
  }, [])

  const handleScreen2Complete = useCallback(() => {
    setTransitioning(true)
    setTimeout(() => { setStep(3); setTransitioning(false) }, 250)
  }, [])

  const handleDavidConfirm = useCallback(() => {
    setTransitioning(true)
    setTimeout(() => { setStep(5); setTransitioning(false) }, 250)
  }, [])

  const handleBookAll = useCallback(() => {
    setStep(8)
  }, [])

  const handleBookingDone = useCallback(() => {
    setStep(9)
  }, [])

  const getActiveTab = () => step >= 10 ? 'trips' : 'book'

  const handleBiofuel = useCallback(() => {
    setTransitioning(true)
    setTimeout(() => { setStep(11); setTransitioning(false) }, 250)
  }, [])

  const handleBiofuelBack = useCallback(() => {
    setTransitioning(true)
    setTimeout(() => { setStep(10); setTransitioning(false) }, 250)
  }, [])

  const renderScreen = () => {
    if (step === 0) return <Screen1 />
    if (step === 1) return <Screen1b onBookAsGroup={handleBookAsGroup} />
    if (step === 2) return <Screen2 onComplete={handleScreen2Complete} />
    if (step === 3) return <PerspectiveSwitch name="David B." onDone={() => setStep(4)} />
    if (step === 4) return <Screen4 showConfirmed={false} onConfirm={handleDavidConfirm} />
    if (step === 5) return <Screen4 showConfirmed={true} />
    if (step === 6) return <BackToOrganizer onDone={() => setStep(7)} />
    if (step === 7) return <Screen3 onBookAll={handleBookAll} />
    if (step === 8) return <BookingAnimation onDone={handleBookingDone} />
    if (step === 9) return <Screen5 />
    if (step === 10) return <Screen6 onBiofuel={handleBiofuel} />
    if (step === 11) return <ScreenBiofuel onDone={handleBiofuelBack} />
    return null
  }

  const getHintText = () => {
    if (step === 10) return 'Tap "Biofuel Bonus" to explore group benefits'
    if (step === 11) return 'Invite remaining members to unlock the group bonus'
    if (step === 1) return 'Tap "Book as Group" to invite friends'
    if (step === 2) return 'Review your group, then send invites'
    if (step === 4) return "Toggle Biofuel, then tap Confirm & Join"
    if (step === 7) return "Send reminders to pending travelers, then Book All"
    return 'Click anywhere on the phone to continue'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 20 }}>
      {/* Demo label */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: C.white, letterSpacing: -0.5 }}>GroupFly</span>
        </div>
        <div style={{ fontSize: 14, color: C.greyLight }}>Group booking for SAS EuroBonus</div>
      </div>

      <ProgressDots current={screenIndex} total={totalScreens} />

      {/* Phone frame */}
      <div
        onClick={(!isOverlay && !isInteractive) ? advance : undefined}
        style={{
          width: 390, height: 844,
          borderRadius: 44,
          background: C.bg,
          border: '2px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          cursor: (!isOverlay && !isInteractive && step < 10) ? 'pointer' : 'default',
          position: 'relative',
          userSelect: 'none',
        }}
      >
        <StatusBar />
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'translateX(30px)' : 'translateX(0)',
          transition: 'opacity 0.2s ease, transform 0.2s ease'
        }}>
          {renderScreen()}
        </div>
        {!isOverlay && <BottomNav activeTab={getActiveTab()} />}
        <HomeIndicator />
      </div>

      {/* Hint */}
      <div style={{ marginTop: 16, fontSize: 13, color: C.greyLight, textAlign: 'center' }}>
        {getHintText()}
        <span style={{ marginLeft: 8, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          {screenIndex + 1} / {totalScreens}
        </span>
      </div>
    </div>
  )
}

export default App
