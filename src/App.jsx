import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCoGWdjnnE3j9FgClgRzdm8yVXMBTAJKPg",
  authDomain: "study-room-afa3a.firebaseapp.com",
  projectId: "study-room-afa3a",
  storageBucket: "study-room-afa3a.firebasestorage.app",
  messagingSenderId: "546251776377",
  appId: "1:546251776377:web:3e7ca35fa082755a524fa8",
  measurementId: "G-9X1G2EBMES"
};




const THEME_COLORS = {
  blue: {
    label: "파랑",
    accent: "#3182f6",
    accentDark: "#1b64da",
    accentSoft: "#eff6ff",
    accentSoft2: "#dbeafe",
    accentSoft3: "#bfdbfe",
    accentText: "#1d4ed8",
    accentShadow: "rgba(49,130,246,0.24)",
  },
  red: {
    label: "빨강",
    accent: "#e5484d",
    accentDark: "#c92a2f",
    accentSoft: "#fff1f2",
    accentSoft2: "#ffe4e6",
    accentSoft3: "#fecdd3",
    accentText: "#be123c",
    accentShadow: "rgba(229,72,77,0.24)",
  },
  green: {
    label: "초록",
    accent: "#00a661",
    accentDark: "#008c54",
    accentSoft: "#ecfdf3",
    accentSoft2: "#dcfce7",
    accentSoft3: "#bbf7d0",
    accentText: "#047857",
    accentShadow: "rgba(0,166,97,0.24)",
  },
  purple: {
    label: "보라",
    accent: "#8b5cf6",
    accentDark: "#6d28d9",
    accentSoft: "#f5f3ff",
    accentSoft2: "#ede9fe",
    accentSoft3: "#ddd6fe",
    accentText: "#6d28d9",
    accentShadow: "rgba(139,92,246,0.24)",
  },
  black: {
    label: "검정",
    accent: "#191f28",
    accentDark: "#000000",
    accentSoft: "#f2f4f6",
    accentSoft2: "#e5e8eb",
    accentSoft3: "#d1d6db",
    accentText: "#191f28",
    accentShadow: "rgba(25,31,40,0.22)",
  },
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ICONS = {
  logo: "/icons/study-room-logo.png",
  home: "/icons/home-icon.png",
  planner: "/icons/planner-icon.png",
  chat: "/icons/chat-icon.png",
  room: "/icons/room-icon.png",
  profile: "/icons/profile-icon.png",
};



const FLIGHT_COUNTRIES = [
  { code: "KR", name: "대한민국", city: "서울", lat: 37.5665, lon: 126.9780 },
  { code: "JP", name: "일본", city: "도쿄", lat: 35.6762, lon: 139.6503 },
  { code: "CN", name: "중국", city: "베이징", lat: 39.9042, lon: 116.4074 },
  { code: "TW", name: "대만", city: "타이베이", lat: 25.0330, lon: 121.5654 },
  { code: "HK", name: "홍콩", city: "홍콩", lat: 22.3193, lon: 114.1694 },
  { code: "TH", name: "태국", city: "방콕", lat: 13.7563, lon: 100.5018 },
  { code: "VN", name: "베트남", city: "하노이", lat: 21.0278, lon: 105.8342 },
  { code: "PH", name: "필리핀", city: "마닐라", lat: 14.5995, lon: 120.9842 },
  { code: "ID", name: "인도네시아", city: "자카르타", lat: -6.2088, lon: 106.8456 },
  { code: "MY", name: "말레이시아", city: "쿠알라룸푸르", lat: 3.1390, lon: 101.6869 },
  { code: "SG", name: "싱가포르", city: "싱가포르", lat: 1.3521, lon: 103.8198 },
  { code: "IN", name: "인도", city: "뉴델리", lat: 28.6139, lon: 77.2090 },
  { code: "PK", name: "파키스탄", city: "이슬라마바드", lat: 33.6844, lon: 73.0479 },
  { code: "SA", name: "사우디아라비아", city: "리야드", lat: 24.7136, lon: 46.6753 },
  { code: "AE", name: "아랍에미리트", city: "두바이", lat: 25.2048, lon: 55.2708 },
  { code: "TR", name: "튀르키예", city: "이스탄불", lat: 41.0082, lon: 28.9784 },
  { code: "RU", name: "러시아", city: "모스크바", lat: 55.7558, lon: 37.6173 },
  { code: "KZ", name: "카자흐스탄", city: "아스타나", lat: 51.1605, lon: 71.4704 },

  { code: "GB", name: "영국", city: "런던", lat: 51.5074, lon: -0.1278 },
  { code: "FR", name: "프랑스", city: "파리", lat: 48.8566, lon: 2.3522 },
  { code: "DE", name: "독일", city: "베를린", lat: 52.5200, lon: 13.4050 },
  { code: "IT", name: "이탈리아", city: "로마", lat: 41.9028, lon: 12.4964 },
  { code: "ES", name: "스페인", city: "마드리드", lat: 40.4168, lon: -3.7038 },
  { code: "PT", name: "포르투갈", city: "리스본", lat: 38.7223, lon: -9.1393 },
  { code: "NL", name: "네덜란드", city: "암스테르담", lat: 52.3676, lon: 4.9041 },
  { code: "BE", name: "벨기에", city: "브뤼셀", lat: 50.8503, lon: 4.3517 },
  { code: "CH", name: "스위스", city: "취리히", lat: 47.3769, lon: 8.5417 },
  { code: "AT", name: "오스트리아", city: "빈", lat: 48.2082, lon: 16.3738 },
  { code: "SE", name: "스웨덴", city: "스톡홀름", lat: 59.3293, lon: 18.0686 },
  { code: "NO", name: "노르웨이", city: "오슬로", lat: 59.9139, lon: 10.7522 },
  { code: "DK", name: "덴마크", city: "코펜하겐", lat: 55.6761, lon: 12.5683 },
  { code: "FI", name: "핀란드", city: "헬싱키", lat: 60.1699, lon: 24.9384 },
  { code: "PL", name: "폴란드", city: "바르샤바", lat: 52.2297, lon: 21.0122 },
  { code: "CZ", name: "체코", city: "프라하", lat: 50.0755, lon: 14.4378 },
  { code: "GR", name: "그리스", city: "아테네", lat: 37.9838, lon: 23.7275 },

  { code: "US", name: "미국", city: "뉴욕", lat: 40.7128, lon: -74.0060 },
  { code: "CA", name: "캐나다", city: "토론토", lat: 43.6532, lon: -79.3832 },
  { code: "MX", name: "멕시코", city: "멕시코시티", lat: 19.4326, lon: -99.1332 },
  { code: "CU", name: "쿠바", city: "아바나", lat: 23.1136, lon: -82.3666 },
  { code: "BR", name: "브라질", city: "상파울루", lat: -23.5558, lon: -46.6396 },
  { code: "AR", name: "아르헨티나", city: "부에노스아이레스", lat: -34.6037, lon: -58.3816 },
  { code: "CL", name: "칠레", city: "산티아고", lat: -33.4489, lon: -70.6693 },
  { code: "PE", name: "페루", city: "리마", lat: -12.0464, lon: -77.0428 },
  { code: "CO", name: "콜롬비아", city: "보고타", lat: 4.7110, lon: -74.0721 },

  { code: "AU", name: "호주", city: "시드니", lat: -33.8688, lon: 151.2093 },
  { code: "NZ", name: "뉴질랜드", city: "오클랜드", lat: -36.8509, lon: 174.7645 },

  { code: "EG", name: "이집트", city: "카이로", lat: 30.0444, lon: 31.2357 },
  { code: "MA", name: "모로코", city: "카사블랑카", lat: 33.5731, lon: -7.5898 },
  { code: "ZA", name: "남아프리카공화국", city: "케이프타운", lat: -33.9249, lon: 18.4241 },
  { code: "KE", name: "케냐", city: "나이로비", lat: -1.2921, lon: 36.8219 },
  { code: "NG", name: "나이지리아", city: "라고스", lat: 6.5244, lon: 3.3792 },
];

const DEFAULT_UNLOCKED_FLIGHT_COUNTRIES = ["KR", "JP", "US", "GB", "FR", "CN", "AU", "DE"];
const FLIGHT_MILES_PER_MINUTE = 1;
const FLIGHT_UNLOCK_BASE_COST = 80;
const FLIGHT_UNLOCK_DISTANCE_DIVISOR = 180;

const STDR_AIR_TIERS = [
  {
    id: "economy",
    label: "Economy",
    korean: "이코노미",
    threshold: 0,
    badge: "EA",
    plane: "#2563eb",
    accent: "#2563eb",
    accent2: "#0ea5e9",
    stamp: "#1d4ed8",
    ticketBg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 55%, #bfdbfe 100%)",
    ticketText: "#1e3a8a",
    passportBg: "linear-gradient(135deg, #f8fbff 0%, #eff6ff 58%, #dbeafe 100%)",
    rewardBg: "linear-gradient(135deg, #ffffff 0%, #eff6ff 55%, #dbeafe 100%)",
  },
  {
    id: "premium",
    label: "Premium",
    korean: "프리미엄",
    threshold: 1000,
    badge: "PA",
    plane: "#db2777",
    accent: "#7c3aed",
    accent2: "#ec4899",
    stamp: "#be185d",
    ticketBg: "linear-gradient(135deg, #f5f3ff 0%, #fce7f3 55%, #fbcfe8 100%)",
    ticketText: "#4c1d95",
    passportBg: "linear-gradient(135deg, #fff1f2 0%, #f5f3ff 55%, #e9d5ff 100%)",
    rewardBg: "linear-gradient(135deg, #fff7fb 0%, #fce7f3 52%, #f5f3ff 100%)",
  },
  {
    id: "business",
    label: "Business",
    korean: "비즈니스",
    threshold: 3500,
    badge: "BA",
    plane: "#0f766e",
    accent: "#0f766e",
    accent2: "#14b8a6",
    stamp: "#0f766e",
    ticketBg: "linear-gradient(135deg, #ecfeff 0%, #ccfbf1 54%, #99f6e4 100%)",
    ticketText: "#134e4a",
    passportBg: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 52%, #a7f3d0 100%)",
    rewardBg: "linear-gradient(135deg, #ffffff 0%, #ccfbf1 55%, #a7f3d0 100%)",
  },
  {
    id: "first",
    label: "First",
    korean: "퍼스트",
    threshold: 8000,
    badge: "FA",
    plane: "#d97706",
    accent: "#b45309",
    accent2: "#f59e0b",
    stamp: "#92400e",
    ticketBg: "linear-gradient(135deg, #fff7ed 0%, #fde68a 52%, #f59e0b 100%)",
    ticketText: "#78350f",
    passportBg: "linear-gradient(135deg, #fff7ed 0%, #fffbeb 48%, #fde68a 100%)",
    rewardBg: "linear-gradient(135deg, #ffffff 0%, #fef3c7 55%, #fde68a 100%)",
  },
  {
    id: "captain",
    label: "Captain",
    korean: "캡틴",
    threshold: 18000,
    badge: "CP",
    plane: "#fbbf24",
    accent: "#fbbf24",
    accent2: "#f59e0b",
    stamp: "#facc15",
    ticketBg: "linear-gradient(135deg, #1f2937 0%, #92400e 44%, #fbbf24 100%)",
    ticketText: "#fff7ed",
    passportBg: "linear-gradient(135deg, #111827 0%, #451a03 45%, #b45309 100%)",
    rewardBg: "linear-gradient(135deg, #111827 0%, #78350f 52%, #f59e0b 100%)",
  },
];

function getStdrAirTier(totalMiles = 0) {
  const safeMiles = Math.max(0, Number(totalMiles) || 0);
  let current = STDR_AIR_TIERS[0];

  STDR_AIR_TIERS.forEach((tier) => {
    if (safeMiles >= tier.threshold) current = tier;
  });

  const index = STDR_AIR_TIERS.findIndex((tier) => tier.id === current.id);
  const next = STDR_AIR_TIERS[index + 1] || null;
  const progress = next
    ? Math.max(0, Math.min(100, Math.round(((safeMiles - current.threshold) / (next.threshold - current.threshold)) * 100)))
    : 100;

  return {
    current,
    next,
    progress,
    remaining: next ? Math.max(0, next.threshold - safeMiles) : 0,
  };
}

function getStdrTierStyle(tierOrId) {
  const id = typeof tierOrId === "string" ? tierOrId : tierOrId?.id;
  return STDR_AIR_TIERS.find((tier) => tier.id === id) || STDR_AIR_TIERS[0];
}

function getStdrTierAppTheme(tierOrId) {
  const tier = getStdrTierStyle(tierOrId);
  const softByTier = {
    economy: ["#eff6ff", "#dbeafe", "#bfdbfe", "rgba(37,99,235,0.24)"],
    premium: ["#f5f3ff", "#ede9fe", "#ddd6fe", "rgba(124,58,237,0.24)"],
    business: ["#ecfeff", "#ccfbf1", "#99f6e4", "rgba(15,118,110,0.24)"],
    first: ["#fffbeb", "#fef3c7", "#fde68a", "rgba(180,83,9,0.24)"],
    captain: ["#fffbeb", "#fef3c7", "#fde68a", "rgba(251,191,36,0.30)"],
  };
  const [accentSoft, accentSoft2, accentSoft3, accentShadow] =
    softByTier[tier.id] || softByTier.economy;

  const readableAccentTextByTier = {
    economy: "#1d4ed8",
    premium: "#6d28d9",
    business: "#047857",
    first: "#92400e",
    captain: "#92400e",
  };

  return {
    id: tier.id,
    label: tier.label,
    korean: tier.korean,
    threshold: tier.threshold,
    accent: tier.accent,
    accentDark: tier.accent2,
    accentSoft,
    accentSoft2,
    accentSoft3,
    accentText: readableAccentTextByTier[tier.id] || tier.ticketText,
    accentShadow,
  };
}

function storageGetJson(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "null");
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function storageSetJson(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function uniqueArray(list) {
  return Array.from(new Set((list || []).filter(Boolean)));
}

function flightUnlockCost(country) {
  const home = FLIGHT_COUNTRIES.find((item) => item.code === "KR") || FLIGHT_COUNTRIES[0];
  if (!country || DEFAULT_UNLOCKED_FLIGHT_COUNTRIES.includes(country.code)) return 0;
  return Math.max(
    60,
    Math.round(FLIGHT_UNLOCK_BASE_COST + routeDistanceKm(home, country) / FLIGHT_UNLOCK_DISTANCE_DIVISOR)
  );
}

function passportStampId(fromCode, toCode) {
  return `${fromCode}-${toCode}`;
}

function flightRewardTitle(country) {
  const titles = {
    JP: "도쿄 집중 착륙",
    US: "뉴욕 장거리 집중 완료",
    GB: "런던 클래식 공부 비행",
    FR: "파리 감성 집중 완료",
    CN: "베이징 루트 클리어",
    AU: "시드니 장거리 비행 성공",
    DE: "베를린 집중 루트 완료",
    KR: "서울 귀환 완료",
  };

  return titles[country?.code] || `${country?.city || country?.name || "도착지"} 도착 완료`;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function routeDistanceKm(from, to) {
  const earthKm = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLon = toRad(to.lon - from.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLon / 2) ** 2;

  return Math.round(earthKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function routeFlightMinutes(from, to) {
  const distance = routeDistanceKm(from, to);
  return Math.max(25, Math.round((distance / 850) * 60 + 35));
}

function formatFlightTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h <= 0) return `${m}분`;
  return `${h}시간 ${m}분`;
}

function normalizeLon(lon) {
  let next = lon;
  while (next < -180) next += 360;
  while (next > 180) next -= 360;
  return next;
}

const FLIGHT_MAP_WIDTH = 1672;
const FLIGHT_MAP_HEIGHT = 941;

// The background image is a stylized world map, not a mathematically perfect
// equirectangular map. These calibration values align markers with the visible
// continents in /public/images/blue-world-map.png.
const FLIGHT_MAP_CENTER_X = 815;
const FLIGHT_MAP_LON_SCALE = 4.0;
const FLIGHT_MAP_EQUATOR_Y = 530;
const FLIGHT_MAP_LAT_SCALE = 4.67;

const FLIGHT_MARKER_POSITIONS = {
  KR: { x: 1362, y: 420 },
  JP: { x: 1440, y: 435 },
  CN: { x: 1300, y: 430 },
  TW: { x: 1348, y: 507 },
  HK: { x: 1310, y: 500 },
  TH: { x: 1275, y: 580 },
  VN: { x: 1285, y: 540 },
  PH: { x: 1375, y: 585 },
  ID: { x: 1280, y: 690 },
  MY: { x: 1270, y: 635 },
  SG: { x: 1285, y: 650 },
  IN: { x: 1165, y: 545 },
  PK: { x: 1115, y: 500 },
  SA: { x: 1020, y: 525 },
  AE: { x: 1070, y: 535 },
  TR: { x: 920, y: 430 },
  RU: { x: 950, y: 315 },
  KZ: { x: 1065, y: 390 },

  GB: { x: 760, y: 330 },
  FR: { x: 795, y: 370 },
  DE: { x: 835, y: 335 },
  IT: { x: 850, y: 425 },
  ES: { x: 770, y: 430 },
  PT: { x: 735, y: 430 },
  NL: { x: 810, y: 350 },
  BE: { x: 800, y: 365 },
  CH: { x: 820, y: 390 },
  AT: { x: 850, y: 382 },
  SE: { x: 845, y: 270 },
  NO: { x: 810, y: 245 },
  DK: { x: 820, y: 320 },
  FI: { x: 875, y: 255 },
  PL: { x: 870, y: 350 },
  CZ: { x: 845, y: 370 },
  GR: { x: 890, y: 445 },

  US: { x: 390, y: 440 },
  CA: { x: 370, y: 390 },
  MX: { x: 285, y: 510 },
  CU: { x: 395, y: 525 },
  BR: { x: 520, y: 645 },
  AR: { x: 505, y: 750 },
  CL: { x: 462, y: 740 },
  PE: { x: 430, y: 620 },
  CO: { x: 425, y: 560 },

  AU: { x: 1375, y: 770 },
  NZ: { x: 1530, y: 820 },

  EG: { x: 930, y: 500 },
  MA: { x: 760, y: 500 },
  ZA: { x: 900, y: 800 },
  KE: { x: 965, y: 630 },
  NG: { x: 810, y: 595 },
};

function getFlightMarkerPoint(country) {
  return FLIGHT_MARKER_POSITIONS[country.code] || projectFlightPoint(country.lat, country.lon);
}

function clampFlightMapPoint(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function projectFlightPoint(lat, lon) {
  const x = FLIGHT_MAP_CENTER_X + normalizeLon(lon) * FLIGHT_MAP_LON_SCALE;
  const y = FLIGHT_MAP_EQUATOR_Y - lat * FLIGHT_MAP_LAT_SCALE;

  return {
    x: clampFlightMapPoint(x, 24, FLIGHT_MAP_WIDTH - 24),
    y: clampFlightMapPoint(y, 34, FLIGHT_MAP_HEIGHT - 34),
  };
}

function interpolateGreatCirclePoint(from, to, fraction) {
  const lat1 = toRad(from.lat);
  const lon1 = toRad(from.lon);
  const lat2 = toRad(to.lat);
  const lon2 = toRad(to.lon);

  const delta =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2
      )
    );

  if (!Number.isFinite(delta) || delta === 0) {
    return { lat: from.lat, lon: from.lon };
  }

  const a = Math.sin((1 - fraction) * delta) / Math.sin(delta);
  const b = Math.sin(fraction * delta) / Math.sin(delta);

  const x = a * Math.cos(lat1) * Math.cos(lon1) + b * Math.cos(lat2) * Math.cos(lon2);
  const y = a * Math.cos(lat1) * Math.sin(lon1) + b * Math.cos(lat2) * Math.sin(lon2);
  const z = a * Math.sin(lat1) + b * Math.sin(lat2);

  return {
    lat: Math.atan2(z, Math.sqrt(x * x + y * y)) * (180 / Math.PI),
    lon: Math.atan2(y, x) * (180 / Math.PI),
  };
}

function buildGreatCircleRoute(from, to, steps = 80) {
  const points = Array.from({ length: steps + 1 }, (_, index) => {
    const fraction = index / steps;
    const geo = interpolateGreatCirclePoint(from, to, fraction);
    const projected = projectFlightPoint(geo.lat, geo.lon);

    return {
      ...geo,
      ...projected,
    };
  });

  const segments = [];
  let current = [points[0]];

  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const next = points[i];

    if (Math.abs(next.x - prev.x) > 1672 / 2) {
      segments.push(current);
      current = [next];
    } else {
      current.push(next);
    }
  }

  segments.push(current);

  return { points, segments };
}

function svgPolylinePoints(points) {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
}

function buildVisibleFlightRoute(from, to, steps = 96) {
  const start = getFlightMarkerPoint(from);
  const end = getFlightMarkerPoint(to);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
  const curve = Math.min(190, Math.max(42, distance * 0.16));
  const control = {
    x: (start.x + end.x) / 2,
    y: clampFlightMapPoint(Math.min(start.y, end.y) - curve, 46, FLIGHT_MAP_HEIGHT - 46),
  };

  const points = Array.from({ length: steps + 1 }, (_, index) => {
    const t = index / steps;
    const x = (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x;
    const y = (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y;

    return { x, y };
  });

  return { points, segments: [points] };
}

function IconImage({ src, alt, size = 32, style = {} }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        ...style,
      }}
    />
  );
}

function StudyRoomLogo({ dark = false, size = 34 }) {
  const bg = dark ? "rgba(15,23,42,0.92)" : "rgba(239,246,255,0.95)";
  const stroke = dark ? "rgba(96,165,250,0.72)" : "rgba(37,99,235,0.30)";
  const text = dark ? "#dbeafe" : "#1d4ed8";
  const glow = dark ? "rgba(96,165,250,0.38)" : "rgba(37,99,235,0.16)";

  return (
    <div
      aria-label="Study Room"
      title="Study Room"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.32),
        background: bg,
        border: `1px solid ${stroke}`,
        boxShadow: `0 10px 24px ${glow}, inset 0 0 0 1px rgba(255,255,255,0.06)`,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        flex: "0 0 auto",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={Math.round(size * 0.82)}
        height={Math.round(size * 0.82)}
        style={{ display: "block" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="srLogoStroke" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={dark ? "#93c5fd" : "#2563eb"} />
            <stop offset="100%" stopColor={dark ? "#38bdf8" : "#0ea5e9"} />
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="84" height="84" rx="20" fill="none" stroke="url(#srLogoStroke)" strokeWidth="5" />
        <text
          x="50"
          y="43"
          textAnchor="middle"
          fontSize="27"
          fontWeight="950"
          fill={text}
          fontFamily="Pretendard, Inter, system-ui, sans-serif"
          letterSpacing="-2"
        >
          ㅅㅌ
        </text>
        <text
          x="50"
          y="73"
          textAnchor="middle"
          fontSize="27"
          fontWeight="950"
          fill={text}
          fontFamily="Pretendard, Inter, system-ui, sans-serif"
          letterSpacing="-2"
        >
          ㄷㄹ
        </text>
      </svg>
    </div>
  );
}

function NavSvgIcon({ type, active = false, dark = false, size = 26 }) {
  const stroke = active
    ? "#ffffff"
    : dark
      ? "#dbeafe"
      : "#1e293b";
  const soft = active
    ? "rgba(255,255,255,0.28)"
    : dark
      ? "rgba(96,165,250,0.22)"
      : "rgba(37,99,235,0.12)";

  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: { display: "block" },
    "aria-hidden": true,
  };

  if (type === "profile") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.1" fill={soft} />
        <path d="M5.2 19.2c.8-3.8 3.2-5.8 6.8-5.8s6 2 6.8 5.8" />
        <path d="M8.2 19.2h7.6" />
      </svg>
    );
  }

  if (type === "room") {
    return (
      <svg {...common}>
        <rect x="4" y="6.2" width="16" height="12.2" rx="3" fill={soft} />
        <path d="M8 10h4.2" />
        <path d="M8 13.4h8" />
        <path d="M15.6 6.2v12.2" />
      </svg>
    );
  }

  if (type === "planner") {
    return (
      <svg {...common}>
        <rect x="5" y="4.8" width="14" height="15" rx="3" fill={soft} />
        <path d="M8.2 3.5v3" />
        <path d="M15.8 3.5v3" />
        <path d="M8.2 10.3h7.6" />
        <path d="M8.2 13.6h5.4" />
        <path d="M8.2 16.9h3.8" />
      </svg>
    );
  }

  if (type === "chat") {
    return (
      <svg {...common}>
        <path d="M5.5 6.5h13v8.7a2.5 2.5 0 0 1-2.5 2.5h-5.5L6 20v-2.3h-.5A2.5 2.5 0 0 1 3 15.2V9a2.5 2.5 0 0 1 2.5-2.5Z" fill={soft} />
        <path d="M8 10.3h8" />
        <path d="M8 13.5h5.8" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M4.5 11.2 12 5l7.5 6.2" />
      <path d="M6.5 10.4v8.1h4v-4.4h3v4.4h4v-8.1" fill={soft} />
    </svg>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "var(--app-bg)",
    color: "var(--text-main)",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    padding: 0,
    margin: 0,
    boxSizing: "border-box",
    overflowX: "hidden",
  },
  wrap: {
    width: "100%",
    maxWidth: "none",
    minHeight: "100vh",
    margin: 0,
    background: "var(--app-bg)",
    borderRadius: 0,
    padding: "14px 18px",
    boxSizing: "border-box",
    overflowX: "hidden",
  },
  card: {
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    borderRadius: 24,
    padding: 16,
    boxShadow: "0 12px 34px rgba(25,31,40,0.06)",
  },
  input: {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid transparent",
  borderRadius: 16,
  padding: "10px 12px",
  fontSize: 13,
  outline: "none",
  background: "var(--input-bg)",
  color: "var(--text-main)",
  WebkitTextFillColor: "var(--text-main)",
  caretColor: "var(--accent)",
},
  textarea: {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid transparent",
  borderRadius: 16,
  padding: "10px 12px",
  fontSize: 13,
  outline: "none",
  minHeight: 58,
  resize: "vertical",
  background: "var(--input-bg)",
  color: "var(--text-main)",
  WebkitTextFillColor: "var(--text-main)",
  caretColor: "var(--accent)",
},
  button: {
    border: "none",
    borderRadius: 16,
    padding: "10px 14px",
    fontWeight: 850,
    cursor: "pointer",
    background: "var(--accent)",
    color: "white",
    boxShadow: "0 8px 18px var(--accent-shadow)",
  },
  lightButton: {
    border: "1px solid transparent",
    borderRadius: 16,
    padding: "10px 14px",
    fontWeight: 850,
    cursor: "pointer",
    background: "var(--input-bg)",
    color: "var(--text-main)",
  },
  small: { color: "var(--text-sub)", fontSize: 12 },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 800,
    color: "var(--text-mid)",
    marginBottom: 4,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 10,
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 10,
  },
  modalBg: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.25)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    zIndex: 50,
    padding: 16,
    overflowY: "auto",
    overscrollBehavior: "contain",
    WebkitOverflowScrolling: "touch",
  },
  modal: {
    width: "100%",
    maxWidth: 850,
    maxHeight: "calc(100dvh - 32px)",
    overflowY: "auto",
    overscrollBehavior: "contain",
    WebkitOverflowScrolling: "touch",
    background: "var(--card-bg-solid)",
    borderRadius: 28,
    padding: 18,
    margin: "0 auto",
  },
};

const todayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const studyDayString = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(d.getHours() - 6);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const nowTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(
    2,
    "0"
  )}`;
};

const timeLabelFromMs = (ms) => {
  const d = new Date(ms || Date.now());
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const INACTIVE_AUTO_STOP_MS = 5 * 60 * 60 * 1000;

const formatTimer = (sec) => {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const formatStudy = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}시간 ${m}분`;
  return `${m}분`;
};

const normalizeId = (v) => v.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12);
const normalizePw = (v) => v.replace(/[^a-zA-Z0-9*-]/g, "").slice(0, 20);
const normalizeRoomCode = (v) =>
  v.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8);
const normalizeRoomPw = (v) => v.replace(/[^0-9]/g, "").slice(0, 8);
const loginEmail = (id) => `${id}@studyroom.local`;

const timeTableHours = [
  ...Array.from({ length: 18 }, (_, i) => `${String(i + 6).padStart(2, "0")}:00`),
  ...Array.from({ length: 6 }, (_, i) => `${String(i).padStart(2, "0")}:00`),
];

const parseTimeMinutes = (time) => {
  const [h, m] = String(time || "00:00").split(":").map((v) => Number(v));
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
};

const studyOrderMinutes = (time) => {
  const minutes = parseTimeMinutes(time);
  return minutes < 360 ? minutes + 1440 : minutes;
};

const SOUND_OPTIONS = [
  { id: "white", label: "백색소음", src: "/sounds/white.mp3" },
  { id: "rain", label: "빗소리", src: "/sounds/rain.mp3" },
  { id: "fireplace", label: "장작소리", src: "/sounds/fireplace.mp3" },
  { id: "whale", label: "고래소리", src: "/sounds/whale.mp3" },
  { id: "airplane", label: "비행기 소리", src: "/sounds/airplane.mp3", notice: "초반에 안내방송이 들어 있습니다. 집중 전 미리 확인해 주세요." },
];

const TIMETABLE_COLOR_PRESETS = [
  {
    id: "blue",
    label: "파랑",
    light: { bg: "rgba(147,197,253,0.72)", border: "rgba(96,165,250,0.82)", text: "#1e3a8a" },
    dark: { bg: "rgba(59,130,246,0.42)", border: "rgba(147,197,253,0.50)", text: "#dbeafe" },
  },
  {
    id: "sky",
    label: "하늘",
    light: { bg: "rgba(125,211,252,0.72)", border: "rgba(56,189,248,0.78)", text: "#075985" },
    dark: { bg: "rgba(14,165,233,0.38)", border: "rgba(125,211,252,0.48)", text: "#e0f2fe" },
  },
  {
    id: "cyan",
    label: "청록",
    light: { bg: "rgba(153,246,228,0.76)", border: "rgba(45,212,191,0.74)", text: "#134e4a" },
    dark: { bg: "rgba(13,148,136,0.36)", border: "rgba(94,234,212,0.42)", text: "#ccfbf1" },
  },
  {
    id: "green",
    label: "초록",
    light: { bg: "rgba(187,247,208,0.78)", border: "rgba(74,222,128,0.74)", text: "#14532d" },
    dark: { bg: "rgba(22,163,74,0.34)", border: "rgba(134,239,172,0.42)", text: "#dcfce7" },
  },
  {
    id: "lime",
    label: "연두",
    light: { bg: "rgba(217,249,157,0.76)", border: "rgba(163,230,53,0.72)", text: "#365314" },
    dark: { bg: "rgba(101,163,13,0.32)", border: "rgba(190,242,100,0.42)", text: "#ecfccb" },
  },
  {
    id: "yellow",
    label: "노랑",
    light: { bg: "rgba(254,240,138,0.70)", border: "rgba(250,204,21,0.72)", text: "#713f12" },
    dark: { bg: "rgba(202,138,4,0.32)", border: "rgba(253,224,71,0.42)", text: "#fef9c3" },
  },
  {
    id: "orange",
    label: "주황",
    light: { bg: "rgba(254,215,170,0.78)", border: "rgba(251,146,60,0.72)", text: "#7c2d12" },
    dark: { bg: "rgba(234,88,12,0.32)", border: "rgba(251,146,60,0.44)", text: "#ffedd5" },
  },
  {
    id: "red",
    label: "빨강",
    light: { bg: "rgba(254,202,202,0.78)", border: "rgba(248,113,113,0.78)", text: "#7f1d1d" },
    dark: { bg: "rgba(185,28,28,0.34)", border: "rgba(248,113,113,0.44)", text: "#fee2e2" },
  },
  {
    id: "pink",
    label: "분홍",
    light: { bg: "rgba(251,207,232,0.78)", border: "rgba(244,114,182,0.70)", text: "#831843" },
    dark: { bg: "rgba(190,24,93,0.38)", border: "rgba(244,114,182,0.48)", text: "#fce7f3" },
  },
  {
    id: "rose",
    label: "장미",
    light: { bg: "rgba(255,228,230,0.86)", border: "rgba(251,113,133,0.72)", text: "#881337" },
    dark: { bg: "rgba(225,29,72,0.32)", border: "rgba(251,113,133,0.44)", text: "#ffe4e6" },
  },
  {
    id: "purple",
    label: "보라",
    light: { bg: "rgba(221,214,254,0.80)", border: "rgba(167,139,250,0.76)", text: "#4c1d95" },
    dark: { bg: "rgba(124,58,237,0.34)", border: "rgba(196,181,253,0.44)", text: "#ede9fe" },
  },
  {
    id: "gray",
    label: "회색",
    light: { bg: "rgba(226,232,240,0.82)", border: "rgba(148,163,184,0.70)", text: "#334155" },
    dark: { bg: "rgba(71,85,105,0.42)", border: "rgba(148,163,184,0.46)", text: "#e2e8f0" },
  },
];

const WEATHER_CODE_LABELS = {
  0: "맑음",
  1: "대체로 맑음",
  2: "구름 조금",
  3: "흐림",
  45: "안개",
  48: "서리 안개",
  51: "약한 이슬비",
  53: "이슬비",
  55: "강한 이슬비",
  56: "어는 이슬비",
  57: "강한 어는 이슬비",
  61: "약한 비",
  63: "비",
  65: "강한 비",
  66: "어는 비",
  67: "강한 어는 비",
  71: "약한 눈",
  73: "눈",
  75: "강한 눈",
  77: "싸락눈",
  80: "약한 소나기",
  81: "소나기",
  82: "강한 소나기",
  85: "약한 눈 소나기",
  86: "강한 눈 소나기",
  95: "천둥번개",
  96: "우박 동반 천둥번개",
  99: "강한 우박 동반 천둥번개",
};

const weatherLabel = (code) => WEATHER_CODE_LABELS[code] || "날씨 정보";

const weatherDayLabel = (date, index) => {
  if (index === 0) return "오늘";
  if (index === 1) return "내일";
  if (index === 2) return "모레";
  return date;
};

const RIGHT_PANEL_DEFAULT_ORDER = ["theme", "total", "flightTicket", "flightStatus", "weather", "dday", "rank"];

const RIGHT_PANEL_LABELS = {
  theme: "테마",
  total: "오늘 총 공부시간",
  flightTicket: "비행 티켓",
  flightStatus: "비행 상태",
  weather: "주간 날씨",
  dday: "오늘 할 일",
  rank: "그룹원 현황 및 랭킹",
};

const MOBILE_HOME_DEFAULT_ORDER = ["stats", "study", "sound", "weather", "dday"];

const MOBILE_HOME_LABELS = {
  stats: "오늘 현황",
  study: "순공 측정",
  sound: "백색소음",
  weather: "주간 날씨",
  dday: "오늘 할 일",
};

function Modal({ title, onClose, children }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    if (closing) return;

    setClosing(true);
    window.setTimeout(() => {
      onClose();
    }, 520);
  };

  return (
    <div
      style={{
        ...S.modalBg,
        animation: closing
          ? "srOverlayFadeOut 520ms cubic-bezier(0.16, 1, 0.3, 1) forwards"
          : "srOverlayFade 360ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          ...S.modal,
          animation: closing
            ? "srModalPopOut 520ms cubic-bezier(0.16, 1, 0.3, 1) forwards"
            : "srModalPop 460ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ marginTop: 0 }}>{title}</h2>
          <button style={S.lightButton} onClick={handleClose}>
            닫기
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        borderTop: "1px solid var(--border)",
        paddingTop: 6,
        marginTop: 12,
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: 1.2,
        color: "var(--text-mid)",
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  // Stable recovery build: removes the experimental 16-fix runtime changes that caused a blank screen.

  const today = studyDayString();
  const isCompactScreen = typeof window !== "undefined" && window.innerWidth <= 900;

  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [authMode, setAuthMode] = useState("login");
  const [authMsg, setAuthMsg] = useState("");
  const [mobileTab, setMobileTab] = useState("home");
  const [sectionTransitionKey, setSectionTransitionKey] = useState(0);
  const [appMode, setAppMode] = useState(() => {
    if (typeof window === "undefined") return "advanced";
    if (window.innerWidth <= 900) return "easy";

    const savedMode = window.localStorage.getItem("studyRoomAppMode");
    if (["advanced", "easy"].includes(savedMode)) return savedMode;

    return window.localStorage.getItem("studyRoomDesktopEasyMode") === "true" ? "easy" : "advanced";
  });
  const desktopEasyMode = appMode === "easy";
  const easyLayout = isCompactScreen || desktopEasyMode;
  const changeAppMode = (nextMode) => {
    const safeMode =
      typeof window !== "undefined" && window.innerWidth <= 900 ? "easy" : nextMode;

    setAppMode(safeMode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("studyRoomAppMode", safeMode);
      window.localStorage.setItem("studyRoomDesktopEasyMode", String(safeMode === "easy"));
    }
    setMobileTab("home");
    setSectionTransitionKey((key) => key + 1);
  };
  const toggleFlightFeature = () => {
    setFlightFeatureOpen((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("studyRoomFlightFeatureOpen", next ? "true" : "false");
      }

      if (!next) {
        setFlightFullscreenOpen(false);
      }

      return next;
    });
  };

  const changeFlightMapZoom = (zoomUpdater, event) => {
    const localViewport =
      event?.currentTarget
        ?.closest(".flight-dashboard-card")
        ?.querySelector(".flight-map-viewport") || flightMapViewportRef.current;

    const focus = localViewport
      ? {
          centerXRatio:
            (localViewport.scrollLeft + localViewport.clientWidth / 2) /
            Math.max(1, localViewport.scrollWidth),
          centerYRatio:
            (localViewport.scrollTop + localViewport.clientHeight / 2) /
            Math.max(1, localViewport.scrollHeight),
        }
      : { centerXRatio: 0.5, centerYRatio: 0.5 };

    flightMapZoomTargetRef.current = localViewport;

    setFlightMapZoom((prev) => {
      const nextValue = typeof zoomUpdater === "function" ? zoomUpdater(prev) : zoomUpdater;
      const nextZoom = Math.max(1, Math.min(6, Number(nextValue.toFixed(2))));
      flightMapZoomFocusRef.current = focus;
      return nextZoom;
    });
  };

  const switchEasyTab = (nextTab) => {
    setMobileTab((prev) => {
      if (prev === nextTab) return prev;
      setSectionTransitionKey((key) => key + 1);
      return nextTab;
    });
  };
  const toggleDesktopMode = () => {
    changeAppMode(appMode === "advanced" ? "easy" : "advanced");
  };
  const [totalFlightMilesEarned, setTotalFlightMilesEarned] = useState(() => {
    const saved = Number(typeof window !== "undefined" ? window.localStorage.getItem("studyRoomTotalFlightMilesEarned") : 0);
    return Number.isFinite(saved) ? saved : 0;
  });
  const [stdrThemeId, setStdrThemeId] = useState(() => {
    if (typeof window === "undefined") return "economy";
    return window.localStorage.getItem("studyRoomStdrThemeId") || "economy";
  });
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("studyRoomDarkMode") === "true";
  });
  const unlockedStdrThemeIds = STDR_AIR_TIERS
    .filter((tier) => totalFlightMilesEarned >= tier.threshold)
    .map((tier) => tier.id);
  const highestUnlockedStdrTheme = getStdrAirTier(totalFlightMilesEarned).current;
  const selectedStdrThemeId = unlockedStdrThemeIds.includes(stdrThemeId)
    ? stdrThemeId
    : highestUnlockedStdrTheme.id;
  const currentTheme = getStdrTierAppTheme(selectedStdrThemeId);
  const modeAccent = currentTheme.accent;
  const currentIcons = ICONS;
  const themeVars = {
    "--accent": modeAccent,
    "--accent-dark": currentTheme.accentDark,
    "--accent-soft": currentTheme.accentSoft,
    "--accent-soft-2": currentTheme.accentSoft2,
    "--accent-soft-3": currentTheme.accentSoft3,
    "--accent-text": currentTheme.accentText,
    "--accent-shadow": currentTheme.accentShadow,
    "--app-bg": darkMode ? "#0b1220" : "#f7f8fa",
    "--card-bg": darkMode ? "rgba(15,23,42,0.94)" : "rgba(255,255,255,0.96)",
    "--card-bg-solid": darkMode ? "#111827" : "white",
    "--text-main": darkMode ? "#e5e7eb" : "#191f28",
    "--text-sub": darkMode ? "#94a3b8" : "#8b95a1",
    "--text-mid": darkMode ? "#cbd5e1" : "#4e5968",
    "--input-bg": darkMode ? "#1e293b" : "#f2f4f6",
    "--soft-bg": darkMode ? "#111827" : "#f7f8fa",
    "--soft-bg-2": darkMode ? "#1e293b" : "#f2f4f6",
    "--border": darkMode ? "rgba(71,85,105,0.74)" : "rgba(229,232,235,0.85)",
    "--border-soft": darkMode ? "rgba(71,85,105,0.52)" : "#eef1f4",
    "--flight-blue": "#2563eb",
    "--flight-sky": "#0ea5e9",
    "--flight-cloud": darkMode ? "#0f172a" : "#f8fbff",
    "--flight-navy": darkMode ? "#e5e7eb" : "#0f172a",
    "--flight-green": "#22c55e",
  };
  const changeStdrTheme = (nextThemeId) => {
    const safeThemeId = unlockedStdrThemeIds.includes(nextThemeId)
      ? nextThemeId
      : highestUnlockedStdrTheme.id;

    setStdrThemeId(safeThemeId);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("studyRoomStdrThemeId", safeThemeId);
      window.localStorage.removeItem("studyRoomTheme");
    }
  };
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("studyRoomDarkMode", next ? "true" : "false");
      }
      return next;
    });
  };

  const cycleUnlockedStdrTheme = () => {
    const keys = unlockedStdrThemeIds.length ? unlockedStdrThemeIds : ["economy"];
    const currentIndex = Math.max(0, keys.indexOf(selectedStdrThemeId));
    const nextTheme = keys[(currentIndex + 1) % keys.length] || highestUnlockedStdrTheme.id;
    changeStdrTheme(nextTheme);
  };

  const renderTopModeControls = (compact = false) => {
    if (isCompactScreen && !compact) return null;

    const modes = [
      { id: "advanced", label: "고급" },
      { id: "easy", label: "쉬운" },
    ];

    return (
      <div className="top-mode-controls">
        <button
          type="button"
          className="top-appearance-button stdr-theme-button"
          onClick={cycleUnlockedStdrTheme}
          title={`STDR Air 등급 해금 테마 변경 · 현재 ${currentTheme.label}`}
        >
          테마 {currentTheme.label}
        </button>
        <button
          type="button"
          className="top-appearance-button"
          onClick={toggleDarkMode}
          title="라이트/다크 모드 전환"
        >
          {darkMode ? "라이트" : "다크"}
        </button>

        {modes.map((mode) => {
          const active = appMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              className={active ? "top-mode-button active" : "top-mode-button"}
              onClick={() => changeAppMode(mode.id)}
            >
              {mode.label}
            </button>
          );
        })}

        <button
          type="button"
          className={flightFeatureOpen ? "top-mode-button flight active" : "top-mode-button flight"}
          onClick={toggleFlightFeature}
        >
          {flightFeatureOpen ? "비행 ON" : "비행 OFF"}
        </button>
      </div>
    );
  };
  const [signup, setSignup] = useState({ id: "", pw: "", pw2: "" });
  const [login, setLogin] = useState({ id: "", pw: "" });
  const [idCheck, setIdCheck] = useState({ id: "", ok: false, msg: "" });

  const [profile, setProfile] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    displayName: "",
    bio: "",
    defaultGoal: "",
    newPw: "",
    newPw2: "",
  });
  const [profileMsg, setProfileMsg] = useState("");

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [enteredGroupId, setEnteredGroupId] = useState("");
  const [members, setMembers] = useState([]);
  const [groupMsg, setGroupMsg] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [roomMenuOpen, setRoomMenuOpen] = useState(false);
  const [createRoom, setCreateRoom] = useState({
    name: "",
    description: "",
    goal: "",
    password: "",
  });
  const [pendingCode, setPendingCode] = useState("");
  const [codeMsg, setCodeMsg] = useState("");
  const [joinRoom, setJoinRoom] = useState({ code: "", password: "" });
  const [showRoomPassword, setShowRoomPassword] = useState(false);

  const [subjects, setSubjects] = useState([
    "국어",
    "수학",
    "영어",
    "생활과 윤리",
    "화학",
    "생명과학",
    "한국사",
  ]);
  const [subject, setSubject] = useState("영어");
  const [subjectPickerOpen, setSubjectPickerOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [detail, setDetail] = useState("");
  const [taskColorMap, setTaskColorMap] = useState(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(window.localStorage.getItem("studyRoomTaskColorMapV2") || "{}");
    } catch {
      return {};
    }
  });
  const [taskColorPickerVisible, setTaskColorPickerVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("studyRoomTaskColorPickerVisible") === "true";
  });

  const [studying, setStudying] = useState(false);
  const [totalSec, setTotalSec] = useState(0);
  const [sessionSec, setSessionSec] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [liveStudy, setLiveStudy] = useState(null);
  const [nowTick, setNowTick] = useState(Date.now());
  const [devPanelOpen, setDevPanelOpen] = useState(false);
  const [devAuthed, setDevAuthed] = useState(false);
  const [devPassword, setDevPassword] = useState("");
  const [devTimeOffsetSec, setDevTimeOffsetSec] = useState(0);

  const [records, setRecords] = useState([]);
  const [groupRecords, setGroupRecords] = useState([]);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatNotice, setChatNotice] = useState(true);
  const [unread, setUnread] = useState(0);
  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState("");

  const soundRef = useRef(null);
  const soundRefB = useRef(null);
  const soundLoopTimerRef = useRef(null);
  const activeSoundRef = useRef("a");
  const soundPlayingRef = useRef(false);
  const soundTransitioningRef = useRef(false);
  const soundVolumeRef = useRef(45);
  const currentSoundSrcRef = useRef("");
  const soundAudioCtxRef = useRef(null);
  const soundBufferSourceRef = useRef(null);
  const soundGainRef = useRef(null);
  const soundBufferCacheRef = useRef(new Map());
  const flightMapViewportRef = useRef(null);
  const flightMapZoomFocusRef = useRef(null);
  const flightMapZoomTargetRef = useRef(null);
  const flightAutoLandingRef = useRef(false);
  const inactiveAutoStopRef = useRef(false);
  const chatSendingRef = useRef(false);
  const [soundType, setSoundType] = useState("white");
  const [soundVolume, setSoundVolume] = useState(45);
  const [soundPlaying, setSoundPlaying] = useState(false);

  const [flightFeatureOpen, setFlightFeatureOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("studyRoomFlightFeatureOpen") === "true";
  });
  const [flightFromCode, setFlightFromCode] = useState("KR");
  const [flightToCode, setFlightToCode] = useState("JP");
  const [flightPickTarget, setFlightPickTarget] = useState("to");
  const [flightMapZoom, setFlightMapZoom] = useState(1);
  const [flightTicketCutting, setFlightTicketCutting] = useState(false);
  const [flightTicketUsed, setFlightTicketUsed] = useState(false);
  const [flightFullscreenOpen, setFlightFullscreenOpen] = useState(false);

  useLayoutEffect(() => {
    const focus = flightMapZoomFocusRef.current;
    if (!focus) return;

    let frameOne = null;
    let frameTwo = null;
    let timeoutId = null;

    const applyCenteredScroll = () => {
      const viewport = flightMapZoomTargetRef.current || flightMapViewportRef.current;
      if (!viewport) return;

      const maxLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const maxTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight);

      const nextLeft =
        viewport.scrollWidth * focus.centerXRatio - viewport.clientWidth / 2;
      const nextTop =
        viewport.scrollHeight * focus.centerYRatio - viewport.clientHeight / 2;

      viewport.scrollLeft = Math.max(0, Math.min(maxLeft, nextLeft));
      viewport.scrollTop = Math.max(0, Math.min(maxTop, nextTop));
    };

    applyCenteredScroll();

    frameOne = window.requestAnimationFrame(() => {
      applyCenteredScroll();

      frameTwo = window.requestAnimationFrame(() => {
        applyCenteredScroll();

        timeoutId = window.setTimeout(() => {
          applyCenteredScroll();
          flightMapZoomFocusRef.current = null;
          flightMapZoomTargetRef.current = null;
        }, 180);
      });
    });

    return () => {
      if (frameOne) window.cancelAnimationFrame(frameOne);
      if (frameTwo) window.cancelAnimationFrame(frameTwo);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [flightMapZoom]);


  const [activeFlight, setActiveFlight] = useState(null);
  const [flightMiles, setFlightMiles] = useState(() => {
    const saved = Number(typeof window !== "undefined" ? window.localStorage.getItem("studyRoomFlightMiles") : 0);
    return Number.isFinite(saved) ? saved : 0;
  });
  const [unlockedFlightCountries, setUnlockedFlightCountries] = useState(() => {
    const saved = storageGetJson("studyRoomUnlockedFlightCountries", DEFAULT_UNLOCKED_FLIGHT_COUNTRIES);
    return uniqueArray([...DEFAULT_UNLOCKED_FLIGHT_COUNTRIES, ...(Array.isArray(saved) ? saved : [])]);
  });
  const [passportStamps, setPassportStamps] = useState(() => {
    const saved = storageGetJson("studyRoomPassportStamps", []);
    return Array.isArray(saved) ? saved : [];
  });
  const [arrivalReward, setArrivalReward] = useState(null);
  const [flightProfileLoaded, setFlightProfileLoaded] = useState(false);
  const [tierPreviewOpen, setTierPreviewOpen] = useState(false);
  const [passportOpen, setPassportOpen] = useState(false);
  const [passportPage, setPassportPage] = useState(0);
  const [unlockListOpen, setUnlockListOpen] = useState(false);
  const [devMileageAmount, setDevMileageAmount] = useState(100);
  const [devMileageRemoveAmount, setDevMileageRemoveAmount] = useState(100);
  const [devTotalMileageAmount, setDevTotalMileageAmount] = useState(1000);
  const [devTotalMileageSetValue, setDevTotalMileageSetValue] = useState(0);
  const [devStampFromCode, setDevStampFromCode] = useState("KR");
  const [devStampToCode, setDevStampToCode] = useState("JP");
  const [devDeleteStampId, setDevDeleteStampId] = useState("");

  const [ddays, setDdays] = useState([]);
  const [ddayOpen, setDdayOpen] = useState(false);
  const [selectedDdayId, setSelectedDdayId] = useState("");
  const [plannerDdayId, setPlannerDdayId] = useState("");
  const [editingDdayId, setEditingDdayId] = useState("");
  const [ddayForm, setDdayForm] = useState({
    title: "",
    date: today,
    category: "시험",
    priority: "보통",
    memo: "",
  });

  const [plannerOpen, setPlannerOpen] = useState(false);
  const [plannerDate, setPlannerDate] = useState(today);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [memos, setMemos] = useState({});

  const [weatherDays, setWeatherDays] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherMsg, setWeatherMsg] = useState("위치 권한을 허용하면 주간 날씨를 볼 수 있습니다.");
  const [weatherToast, setWeatherToast] = useState("");

  const [rightPanelOrder, setRightPanelOrder] = useState(() => {
    if (typeof window === "undefined") return RIGHT_PANEL_DEFAULT_ORDER;
    try {
      const saved = JSON.parse(window.localStorage.getItem("studyRoomRightPanelOrder") || "null");
      if (Array.isArray(saved)) {
        const valid = saved.filter((item) => RIGHT_PANEL_DEFAULT_ORDER.includes(item));
        const missing = RIGHT_PANEL_DEFAULT_ORDER.filter((item) => !valid.includes(item));
        return [...valid, ...missing];
      }
    } catch (error) {
      console.error("오른쪽 패널 순서 불러오기 실패:", error);
    }
    return RIGHT_PANEL_DEFAULT_ORDER;
  });
  const [hiddenRightCards, setHiddenRightCards] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(window.localStorage.getItem("studyRoomHiddenRightCards") || "[]");
      return Array.isArray(saved)
        ? saved.filter((item) => RIGHT_PANEL_DEFAULT_ORDER.includes(item))
        : [];
    } catch (error) {
      console.error("오른쪽 패널 숨김 설정 불러오기 실패:", error);
      return [];
    }
  });

  useEffect(() => {
    if (!flightFeatureOpen) return;

    const flightTopCards = ["flightTicket", "flightStatus"];

    setRightPanelOrder((prev) => {
      const rest = prev.filter((cardId) => !flightTopCards.includes(cardId));
      const nextOrder = [...flightTopCards, ...rest];

      setHiddenRightCards((hiddenPrev) => {
        const nextHidden = hiddenPrev.filter((cardId) => !flightTopCards.includes(cardId));
        saveRightPanelSettings(nextOrder, nextHidden);
        return nextHidden;
      });

      return nextOrder;
    });
  }, [flightFeatureOpen]);
  const [rightPanelEditOpen, setRightPanelEditOpen] = useState(false);
  const [mobileHomeOrder, setMobileHomeOrder] = useState(() => {
    if (typeof window === "undefined") return MOBILE_HOME_DEFAULT_ORDER;
    try {
      const saved = JSON.parse(window.localStorage.getItem("studyRoomMobileHomeOrder") || "null");
      if (Array.isArray(saved)) {
        const valid = saved.filter((item) => MOBILE_HOME_DEFAULT_ORDER.includes(item));
        const missing = MOBILE_HOME_DEFAULT_ORDER.filter((item) => !valid.includes(item));
        return [...valid, ...missing];
      }
    } catch (error) {
      console.error("모바일 홈 순서 불러오기 실패:", error);
    }
    return MOBILE_HOME_DEFAULT_ORDER;
  });
  const [mobileHomeEditOpen, setMobileHomeEditOpen] = useState(false);

  // 4,5,6번 기능용 상태는 기존 훅 순서를 최대한 건드리지 않기 위해 state 목록 끝에만 추가합니다.
  const [editingRecordId, setEditingRecordId] = useState("");
  const [editingRecordDetail, setEditingRecordDetail] = useState("");
  const [mealBlocks, setMealBlocks] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(window.localStorage.getItem("studyRoomMealBlocks") || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [mealForm, setMealForm] = useState({
    type: "점심식사",
    start: "12:00",
    end: "13:00",
  });

  useEffect(() => {
    if (typeof document === "undefined") return;

    const shouldLockPageScroll = unlockListOpen || passportOpen || Boolean(arrivalReward);

    if (!shouldLockPageScroll) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverscroll = document.body.style.overscrollBehavior;
    const previousHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
    };
  }, [unlockListOpen, passportOpen, arrivalReward]);

  const uid = user?.uid || "";
  const userId = profile?.userId || "";
  const displayName = profile?.displayName || userId || "나";

  const currentGroup = groups.find((g) => g.id === enteredGroupId) || null;
  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || null;
  const selectedGroupBannedMembers = Object.values(selectedGroup?.bannedMembers || {}).sort(
    (a, b) => (b.bannedAtMs || 0) - (a.bannedAtMs || 0)
  );
  const currentSound = SOUND_OPTIONS.find((item) => item.id === soundType) || SOUND_OPTIONS[0];
  const stdrAirTier = getStdrAirTier(totalFlightMilesEarned);
  const stdrAirTierStyle = getStdrTierStyle(stdrAirTier.current);
  const selectedStdrThemeStyle = getStdrTierStyle(selectedStdrThemeId);

  const isFlightCountryUnlocked = (code) => unlockedFlightCountries.includes(code);

  const getPassportStats = (stamps = passportStamps) => {
    const map = new Map();

    (stamps || []).forEach((stamp) => {
      const code = stamp.toCode;
      if (!code) return;

      const country = FLIGHT_COUNTRIES.find((item) => item.code === code);
      const current = map.get(code) || {
        code,
        name: stamp.toName || country?.name || code,
        city: country?.city || "",
        count: 0,
      };

      current.count += 1;
      map.set(code, current);
    });

    return Array.from(map.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  };

  const syncFlightProfileToServer = async (patch) => {
    if (!uid) return;

    try {
      await setDoc(
        doc(db, "users", uid, "flightProfile", "current"),
        {
          ...patch,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("비행 프로필 서버 저장 실패:", error);
    }
  };

  const saveFlightMiles = (nextMiles) => {
    const safeMiles = Math.max(0, Math.round(Number(nextMiles) || 0));
    setFlightMiles(safeMiles);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("studyRoomFlightMiles", String(safeMiles));
    }
    syncFlightProfileToServer({ flightMiles: safeMiles });
    return safeMiles;
  };

  const saveTotalFlightMilesEarned = (nextMiles) => {
    const safeMiles = Math.max(0, Math.round(Number(nextMiles) || 0));
    setTotalFlightMilesEarned(safeMiles);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("studyRoomTotalFlightMilesEarned", String(safeMiles));
    }
    syncFlightProfileToServer({ totalFlightMilesEarned: safeMiles });
    return safeMiles;
  };

  const saveUnlockedFlightCountries = (nextCodes) => {
    const safeCodes = uniqueArray([...DEFAULT_UNLOCKED_FLIGHT_COUNTRIES, ...(nextCodes || [])]);
    setUnlockedFlightCountries(safeCodes);
    storageSetJson("studyRoomUnlockedFlightCountries", safeCodes);
    syncFlightProfileToServer({ unlockedFlightCountries: safeCodes });
    return safeCodes;
  };

  const savePassportStamps = (nextStamps) => {
    const safeStamps = Array.isArray(nextStamps) ? nextStamps : [];
    setPassportStamps(safeStamps);
    storageSetJson("studyRoomPassportStamps", safeStamps);
    syncFlightProfileToServer({ passportStamps: safeStamps });
    return safeStamps;
  };

  const unlockFlightCountry = (country) => {
    if (!country) return;
    if (isFlightCountryUnlocked(country.code)) return;

    const cost = flightUnlockCost(country);
    if (flightMiles < cost) {
      alert(`${country.name} 해금에는 ${cost} 마일이 필요합니다. 현재 보유 마일: ${flightMiles}M`);
      return;
    }

    const ok = window.confirm(`${cost} 마일을 사용해서 ${country.name} 여행을 해금할까요?`);
    if (!ok) return;

    saveFlightMiles(flightMiles - cost);
    saveUnlockedFlightCountries([...unlockedFlightCountries, country.code]);
  };

  const addPassportStamp = ({ from, to, seconds, milesEarned }) => {
    if (!from || !to) return passportStamps;

    const stamp = {
      id: `${passportStampId(from.code, to.code)}-${Date.now()}`,
      routeId: passportStampId(from.code, to.code),
      fromCode: from.code,
      fromName: from.name,
      fromCity: from.city,
      toCode: to.code,
      toName: to.name,
      toCity: to.city,
      seconds,
      milesEarned,
      landedAt: nowTime(),
      date: todayString(),
    };

    return savePassportStamps([stamp, ...passportStamps].slice(0, 80));
  };

  const addDevFlightMiles = () => {
    const amount = Math.max(0, Math.round(Number(devMileageAmount || 0)));

    if (!amount) {
      alert("추가할 마일리지를 입력해 주세요.");
      return;
    }

    saveFlightMiles(flightMiles + amount);
    saveTotalFlightMilesEarned(totalFlightMilesEarned + amount);
  };

  const removeDevFlightMiles = () => {
    const amount = Math.max(0, Math.round(Number(devMileageRemoveAmount || 0)));

    if (!amount) {
      alert("삭제할 마일리지를 입력해 주세요.");
      return;
    }

    const nextMiles = Math.max(0, flightMiles - amount);
    saveFlightMiles(nextMiles);
  };

  const addDevTotalFlightMiles = () => {
    const amount = Math.max(0, Math.round(Number(devTotalMileageAmount || 0)));

    if (!amount) {
      alert("추가할 누적 마일리지를 입력해 주세요.");
      return;
    }

    saveTotalFlightMilesEarned(totalFlightMilesEarned + amount);
  };

  const removeDevTotalFlightMiles = () => {
    const amount = Math.max(0, Math.round(Number(devTotalMileageAmount || 0)));

    if (!amount) {
      alert("삭제할 누적 마일리지를 입력해 주세요.");
      return;
    }

    saveTotalFlightMilesEarned(Math.max(0, totalFlightMilesEarned - amount));
  };

  const setDevTotalFlightMiles = () => {
    const nextValue = Math.max(0, Math.round(Number(devTotalMileageSetValue || 0)));

    const ok = window.confirm(`누적 획득 마일리지를 ${nextValue.toLocaleString()}M로 직접 설정할까요?`);
    if (!ok) return;

    saveTotalFlightMilesEarned(nextValue);
  };

  const deleteDevPassportStamp = () => {
    if (!passportStamps.length) {
      alert("삭제할 스탬프가 없습니다.");
      return;
    }

    const targetId = devDeleteStampId || passportStamps[0]?.id;
    const targetStamp = passportStamps.find((stamp) => stamp.id === targetId);

    if (!targetStamp) {
      alert("삭제할 스탬프를 선택해 주세요.");
      return;
    }

    const ok = window.confirm(`${targetStamp.fromCode} → ${targetStamp.toCode} 스탬프를 삭제할까요?`);
    if (!ok) return;

    const nextStamps = passportStamps.filter((stamp) => stamp.id !== targetId);
    savePassportStamps(nextStamps);
    setDevDeleteStampId(nextStamps[0]?.id || "");
  };

  const addDevPassportStamp = () => {
    const from = FLIGHT_COUNTRIES.find((country) => country.code === devStampFromCode) || FLIGHT_COUNTRIES[0];
    const to = FLIGHT_COUNTRIES.find((country) => country.code === devStampToCode) || FLIGHT_COUNTRIES[1];

    if (from.code === to.code) {
      alert("출발/도착 국가는 서로 달라야 합니다.");
      return;
    }

    const nextStamps = addPassportStamp({
      from,
      to,
      seconds: 0,
      milesEarned: 0,
    });

    saveUnlockedFlightCountries([...unlockedFlightCountries, from.code, to.code]);
    setDevDeleteStampId(nextStamps[0]?.id || "");
    setArrivalReward({
      from,
      to,
      seconds: 0,
      milesEarned: 0,
      totalMiles: flightMiles,
      totalFlightMilesEarned,
      airlineTier: stdrAirTier.current,
      nextAirlineTier: stdrAirTier.next,
      airlineTierProgress: stdrAirTier.progress,
      stampCount: nextStamps.length,
      title: `${to.name} 개발자 스탬프 추가`,
    });
  };

  const getFlightDetailText = (fromCode = flightFromCode, toCode = flightToCode) => {
    const from = FLIGHT_COUNTRIES.find((c) => c.code === fromCode);
    const to = FLIGHT_COUNTRIES.find((c) => c.code === toCode);

    if (!from || !to || from.code === to.code) return detail.trim() || "비행 집중 공부";
    return `${from.name}에서 ${to.name}까지 비행 집중 공부`;
  };

  const applyFlightDetailByCodes = (fromCode = flightFromCode, toCode = flightToCode) => {
    const nextDetail = getFlightDetailText(fromCode, toCode);
    setDetail(nextDetail);
    return nextDetail;
  };

  const saveRightPanelSettings = (nextOrder, nextHidden) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("studyRoomRightPanelOrder", JSON.stringify(nextOrder));
    window.localStorage.setItem("studyRoomHiddenRightCards", JSON.stringify(nextHidden));
  };

  const moveRightPanelCard = (cardId, direction) => {
    setRightPanelOrder((prev) => {
      const next = [...prev];
      const index = next.indexOf(cardId);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= next.length) return prev;

      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      saveRightPanelSettings(next, hiddenRightCards);
      return next;
    });
  };

  const hideRightPanelCard = (cardId) => {
    setHiddenRightCards((prev) => {
      const nextHidden = Array.from(new Set([...prev, cardId]));
      saveRightPanelSettings(rightPanelOrder, nextHidden);
      return nextHidden;
    });
  };

  const restoreRightPanelCard = (cardId) => {
    setHiddenRightCards((prev) => {
      const nextHidden = prev.filter((item) => item !== cardId);
      saveRightPanelSettings(rightPanelOrder, nextHidden);
      return nextHidden;
    });
  };

  const resetRightPanelLayout = () => {
    const nextOrder = RIGHT_PANEL_DEFAULT_ORDER;
    const nextHidden = [];
    setRightPanelOrder(nextOrder);
    setHiddenRightCards(nextHidden);
    saveRightPanelSettings(nextOrder, nextHidden);
  };

  const saveMobileHomeOrder = (nextOrder) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("studyRoomMobileHomeOrder", JSON.stringify(nextOrder));
  };

  const moveMobileHomeCard = (cardId, direction) => {
    setMobileHomeOrder((prev) => {
      const next = [...prev];
      const index = next.indexOf(cardId);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= next.length) return prev;

      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      saveMobileHomeOrder(next);
      return next;
    });
  };

  const resetMobileHomeOrder = () => {
    setMobileHomeOrder(MOBILE_HOME_DEFAULT_ORDER);
    saveMobileHomeOrder(MOBILE_HOME_DEFAULT_ORDER);
  };

  useEffect(() => {
    if (!weatherToast) return;

    const timer = setTimeout(() => {
      setWeatherToast("");
    }, 5500);

    return () => clearTimeout(timer);
  }, [weatherToast]);

  useEffect(() => {
    setShowRoomPassword(false);
  }, [selectedGroupId]);

  const stopWebAudioSound = () => {
    clearSoundLoopTimer();

    try {
      if (soundBufferSourceRef.current) {
        const source = soundBufferSourceRef.current;
        const audioCtx = soundAudioCtxRef.current;
        const gain = soundGainRef.current;

        source.onended = null;

        if (audioCtx && gain) {
          const now = audioCtx.currentTime;
          gain.gain.cancelScheduledValues(now);
          gain.gain.setTargetAtTime(0, now, 0.025);
          source.stop(now + 0.09);
        } else {
          source.stop(0);
        }

        window.setTimeout(() => {
          try {
            source.disconnect();
          } catch {
            // 이미 disconnect 되었을 수 있습니다.
          }
        }, 140);
      }
    } catch {
      // 이미 정지된 source일 수 있습니다.
    }

    soundBufferSourceRef.current = null;
  };

  const clearSoundLoopTimer = () => {
    if (soundLoopTimerRef.current) {
      window.clearTimeout(soundLoopTimerRef.current);
      soundLoopTimerRef.current = null;
    }
  };

  const resetSoundElement = (audio) => {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
    audio.onloadedmetadata = null;
    audio.oncanplaythrough = null;
    audio.onended = null;
  };

  const getSoundAudioContext = async () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error("이 브라우저는 Web Audio API를 지원하지 않습니다.");
    }

    const audioCtx = soundAudioCtxRef.current || new AudioContextClass();
    soundAudioCtxRef.current = audioCtx;

    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    return audioCtx;
  };

  const createClickSafeLoopBuffer = (audioCtx, sourceBuffer) => {
    const sampleRate = sourceBuffer.sampleRate;
    const channelCount = sourceBuffer.numberOfChannels;
    const totalFrames = sourceBuffer.length;

    // 파일 앞/뒤에 들어 있는 아주 짧은 클릭/무음/컷 지점을 피합니다.
    const trimFrames = Math.min(Math.floor(sampleRate * 0.045), Math.floor(totalFrames * 0.015));
    const fadeFrames = Math.min(Math.floor(sampleRate * 0.18), Math.floor(totalFrames * 0.08));
    const startFrame = trimFrames;
    const endFrame = Math.max(startFrame + fadeFrames + 2, totalFrames - trimFrames);
    const loopFrames = Math.max(1, endFrame - startFrame);

    const outputBuffer = audioCtx.createBuffer(channelCount, loopFrames, sampleRate);

    for (let channel = 0; channel < channelCount; channel += 1) {
      const input = sourceBuffer.getChannelData(channel);
      const output = outputBuffer.getChannelData(channel);

      for (let i = 0; i < loopFrames; i += 1) {
        output[i] = input[startFrame + i] || 0;
      }

      // 루프 마지막 구간을 시작 구간과 미리 섞어서 경계에서 튀는 소리를 줄입니다.
      for (let i = 0; i < fadeFrames; i += 1) {
        const tailIndex = loopFrames - fadeFrames + i;
        const headSample = input[startFrame + i] || 0;
        const tailSample = output[tailIndex] || 0;
        const t = i / Math.max(1, fadeFrames - 1);
        const equalPowerIn = Math.sin((t * Math.PI) / 2);
        const equalPowerOut = Math.cos((t * Math.PI) / 2);

        output[tailIndex] = tailSample * equalPowerOut + headSample * equalPowerIn;
      }

      // 시작과 끝 자체에도 아주 짧은 페이드를 걸어 '틱/타닥'을 한 번 더 방지합니다.
      const edgeFadeFrames = Math.min(Math.floor(sampleRate * 0.018), Math.floor(loopFrames / 8));
      for (let i = 0; i < edgeFadeFrames; i += 1) {
        const t = i / Math.max(1, edgeFadeFrames - 1);
        output[i] *= t;
        output[loopFrames - 1 - i] *= t;
      }
    }

    return outputBuffer;
  };

  const loadSoundBuffer = async (src) => {
    const audioCtx = await getSoundAudioContext();
    const cache = soundBufferCacheRef.current;

    if (cache.has(src)) {
      return cache.get(src);
    }

    const response = await fetch(src, { cache: "force-cache" });
    if (!response.ok) {
      throw new Error(`음원 파일을 불러오지 못했습니다: ${src}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
    const audioBuffer = createClickSafeLoopBuffer(audioCtx, decodedBuffer);

    cache.set(src, audioBuffer);
    return audioBuffer;
  };

  const startWebAudioLoop = async () => {
    const src = currentSoundSrcRef.current || currentSound.src;
    const audioCtx = await getSoundAudioContext();
    const buffer = await loadSoundBuffer(src);

    stopWebAudioSound();

    const source = audioCtx.createBufferSource();
    const gain = soundGainRef.current || audioCtx.createGain();

    soundGainRef.current = gain;

    const now = audioCtx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(soundVolumeRef.current / 100, now + 0.12);

    source.buffer = buffer;
    source.loop = true;
    source.loopStart = 0;
    source.loopEnd = buffer.duration;
    source.connect(gain);
    gain.connect(audioCtx.destination);
    source.start(0);

    soundBufferSourceRef.current = source;
  };

  useEffect(() => {
    soundVolumeRef.current = soundVolume;

    if (soundGainRef.current && soundAudioCtxRef.current) {
      const now = soundAudioCtxRef.current.currentTime;
      soundGainRef.current.gain.cancelScheduledValues(now);
      soundGainRef.current.gain.setTargetAtTime(soundVolume / 100, now, 0.035);
    }

    [soundRef.current, soundRefB.current].forEach((audio) => {
      if (audio && !audio.paused) audio.volume = soundVolume / 100;
    });
  }, [soundVolume]);

  useEffect(() => {
    currentSoundSrcRef.current = currentSound.src;

    if (!soundPlayingRef.current) return;

    window.setTimeout(() => {
      playSound();
    }, 40);
  }, [soundType]);

  useEffect(() => {
    return () => {
      soundPlayingRef.current = false;
      soundTransitioningRef.current = false;
      stopWebAudioSound();

      if (soundAudioCtxRef.current) {
        soundAudioCtxRef.current.close().catch(() => {});
        soundAudioCtxRef.current = null;
      }

      [soundRef.current, soundRefB.current].forEach(resetSoundElement);
    };
  }, []);

  const playSound = async () => {
    try {
      soundPlayingRef.current = true;
      soundTransitioningRef.current = false;
      currentSoundSrcRef.current = currentSound.src;

      [soundRef.current, soundRefB.current].forEach(resetSoundElement);

      await startWebAudioLoop();
      setSoundPlaying(true);
    } catch (error) {
      soundPlayingRef.current = false;
      soundTransitioningRef.current = false;
      setSoundPlaying(false);
      console.error("소리 재생 실패:", error);
      alert("소리를 재생할 수 없습니다. public/sounds 안의 음원 파일 이름과 위치를 확인해 주세요.");
    }
  };

  const stopSound = () => {
    soundPlayingRef.current = false;
    soundTransitioningRef.current = false;
    stopWebAudioSound();
    [soundRef.current, soundRefB.current].forEach(resetSoundElement);
    setSoundPlaying(false);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, "users", uid), (snap) => {
      if (snap.exists()) setProfile({ uid, ...snap.data() });
    });
    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!uid) {
      setFlightProfileLoaded(false);
      return;
    }

    const ref = doc(db, "users", uid, "flightProfile", "current");
    const unsub = onSnapshot(ref, async (snap) => {
      if (!snap.exists()) {
        await setDoc(
          ref,
          {
            flightMiles,
            totalFlightMilesEarned,
            unlockedFlightCountries,
            passportStamps,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        setFlightProfileLoaded(true);
        return;
      }

      const data = snap.data();
      const serverUnlocked = uniqueArray([
        ...DEFAULT_UNLOCKED_FLIGHT_COUNTRIES,
        ...(Array.isArray(data.unlockedFlightCountries) ? data.unlockedFlightCountries : []),
      ]);
      const serverStamps = Array.isArray(data.passportStamps) ? data.passportStamps : [];
      const serverMiles = Math.max(0, Math.round(Number(data.flightMiles || 0)));
      const serverTotalEarned = Math.max(
        serverMiles,
        Math.round(Number(data.totalFlightMilesEarned ?? data.totalMilesEarned ?? serverMiles) || 0)
      );

      setFlightMiles(serverMiles);
      setTotalFlightMilesEarned(serverTotalEarned);
      setUnlockedFlightCountries(serverUnlocked);
      setPassportStamps(serverStamps);
      setFlightProfileLoaded(true);

      if (typeof window !== "undefined") {
        window.localStorage.setItem("studyRoomFlightMiles", String(serverMiles));
        window.localStorage.setItem("studyRoomTotalFlightMilesEarned", String(serverTotalEarned));
        storageSetJson("studyRoomUnlockedFlightCountries", serverUnlocked);
        storageSetJson("studyRoomPassportStamps", serverStamps);
      }
    });

    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!uid) {
      setLiveStudy(null);
      setStudying(false);
      setTotalSec(0);
      setSessionSec(0);
      setStartedAt(null);
      return;
    }

    const liveStudyRef = doc(db, "users", uid, "liveStudy", "current");

    const unsub = onSnapshot(liveStudyRef, (snap) => {
      if (!snap.exists()) {
        setLiveStudy(null);
        setStudying(false);
        setTotalSec(0);
        setSessionSec(0);
        setStartedAt(null);
        return;
      }

      const data = snap.data();
      setLiveStudy(data);

      if (data.studying) {
        setStudying(true);
        setStartedAt(data.startedAtLabel || null);
        if (data.subject) setSubject(data.subject);
        if (data.detail) setDetail(data.detail);

        if (data.flight?.fromCode && data.flight?.toCode) {
          const restoredFrom = FLIGHT_COUNTRIES.find((c) => c.code === data.flight.fromCode) || FLIGHT_COUNTRIES[0];
          const restoredTo = FLIGHT_COUNTRIES.find((c) => c.code === data.flight.toCode) || FLIGHT_COUNTRIES[1];

          setFlightFromCode(restoredFrom.code);
          setFlightToCode(restoredTo.code);
          setFlightFeatureOpen(true);
          setFlightTicketUsed(true);
          setActiveFlight({
            fromCode: restoredFrom.code,
            fromName: restoredFrom.name,
            fromCity: restoredFrom.city,
            toCode: restoredTo.code,
            toName: restoredTo.name,
            toCity: restoredTo.city,
            minutes: data.flight.minutes || routeFlightMinutes(restoredFrom, restoredTo),
            distanceKm: data.flight.distanceKm || routeDistanceKm(restoredFrom, restoredTo),
            startedAt: data.startedAtLabel || null,
            startedAtMs: data.startedAtMs || Date.now(),
          });
        } else {
          setActiveFlight(null);
          setFlightTicketUsed(false);
        }
      } else {
        setStudying(false);
        setTotalSec(0);
        setSessionSec(0);
        setStartedAt(null);
        setActiveFlight(null);
        setFlightTicketUsed(false);
      }
    });

    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!uid) {
      setGroups([]);
      return;
    }

    const unsub = onSnapshot(collection(db, "groups"), (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const mine = all.filter((g) => (g.memberUids || []).includes(uid));
      mine.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setGroups(mine);

      const stillInEnteredGroup = enteredGroupId
        ? mine.some((g) => g.id === enteredGroupId)
        : true;

      if (enteredGroupId && !stillInEnteredGroup) {
        setEnteredGroupId("");
        setSelectedGroupId(mine[0]?.id || "");
        setGroupMsg("현재 방에서 나갔거나 추방되었습니다.");
        return;
      }

      if (!enteredGroupId && mine[0]) {
        setEnteredGroupId(mine[0].id);
        setSelectedGroupId(mine[0].id);
      }
    });

    return () => unsub();
  }, [uid, enteredGroupId]);

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(collection(db, "studyRecords"), (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRecords(all.filter((r) => r.ownerUid === uid));
      setGroupRecords(all);
    });
    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(collection(db, "users", uid, "ddays"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => String(a.date).localeCompare(String(b.date)));
      setDdays(list);

      if (!selectedDdayId && list[0]) {
        setSelectedDdayId(list[0].id);
        setPlannerDdayId(list[0].id);
      }
    });
    return () => unsub();
  }, [uid, selectedDdayId]);

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(collection(db, "users", uid, "plannerMemos"), (snap) => {
      const obj = {};
      snap.docs.forEach((d) => {
        obj[d.id] = d.data().text || "";
      });
      setMemos(obj);
    });
    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!enteredGroupId) {
      setMembers([]);
      setMessages([]);
      return;
    }

    const unsubMembers = onSnapshot(
      collection(db, "groups", enteredGroupId, "members"),
      (snap) => {
        setMembers(snap.docs.map((d) => ({ uid: d.id, ...d.data() })));
      }
    );

    const unsubMessages = onSnapshot(
      collection(db, "groups", enteredGroupId, "messages"),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort(
          (a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
        );
        setMessages(list);
      }
    );

    return () => {
      unsubMembers();
      unsubMessages();
    };
  }, [enteredGroupId]);

  useEffect(() => {
    if (!uid || !enteredGroupId) return;

    const memberRef = doc(db, "groups", enteredGroupId, "members", uid);

    const sendHeartbeat = async () => {
      try {
        await setDoc(
          memberRef,
          {
            uid,
            userId,
            displayName,
            role: currentGroup?.ownerUid === uid ? "방장" : "참여자",
            lastSeenAtMs: Date.now(),
            lastSeenLabel: nowTime(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("접속 상태 업데이트 실패:", error);
      }
    };

    sendHeartbeat();
    const heartbeatTimer = setInterval(sendHeartbeat, 30000);

    const handleVisibilityChange = () => {
      if (!document.hidden) sendHeartbeat();
    };

    window.addEventListener("focus", sendHeartbeat);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(heartbeatTimer);
      window.removeEventListener("focus", sendHeartbeat);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [uid, enteredGroupId, userId, displayName, currentGroup?.ownerUid]);

  useEffect(() => {
    if (!liveStudy?.studying || !liveStudy.startedAtMs) return;

    const updateTimer = () => {
      const baseSeconds = liveStudy.baseSeconds || 0;
      const elapsed = Math.floor((Date.now() - liveStudy.startedAtMs) / 1000);
      const nextSeconds = Math.max(0, baseSeconds + elapsed);

      setTotalSec(nextSeconds);
      setSessionSec(nextSeconds);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [liveStudy]);

  useEffect(() => {
    if (!uid || !liveStudy?.studying) return;

    const liveStudyRef = doc(db, "users", uid, "liveStudy", "current");

    const touchLiveStudyActivity = async () => {
      try {
        await setDoc(
          liveStudyRef,
          {
            lastActiveAtMs: Date.now(),
            lastActiveLabel: nowTime(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("순공 접속 시간 업데이트 실패:", error);
      }
    };

    touchLiveStudyActivity();
    const activityTimer = window.setInterval(touchLiveStudyActivity, 60000);

    window.addEventListener("focus", touchLiveStudyActivity);
    document.addEventListener("visibilitychange", touchLiveStudyActivity);

    return () => {
      window.clearInterval(activityTimer);
      window.removeEventListener("focus", touchLiveStudyActivity);
      document.removeEventListener("visibilitychange", touchLiveStudyActivity);
    };
  }, [uid, liveStudy?.studying]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTick(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!studying) return;
    const last = messages[messages.length - 1];
    if (last && last.senderUid !== uid) setUnread((v) => v + 1);
  }, [messages, studying, uid]);

  const selectedDday = ddays.find((d) => d.id === selectedDdayId) || null;
  const plannerDday = ddays.find((d) => d.id === plannerDdayId) || selectedDday;

  const getRecordStudyDate = (record) => record.studyDate || record.date;
  const todayRecords = records.filter((r) => getRecordStudyDate(r) === today);
  const plannerRecords = records.filter((r) => getRecordStudyDate(r) === plannerDate);
  const todayTotal = todayRecords.reduce((s, r) => s + (r.seconds || 0), 0);
  const currentSessionSeconds = studying ? totalSec : 0;
  const currentSessionStudyDate = liveStudy?.studyDate || today;
  const currentSessionCountsToday = studying && currentSessionStudyDate === today;
  const todayTotalWithLive = todayTotal + (currentSessionCountsToday ? currentSessionSeconds : 0);
  const currentSubjectTodayTotal =
    todayRecords
      .filter((r) => r.subject === subject)
      .reduce((s, r) => s + (r.seconds || 0), 0) +
    (currentSessionCountsToday ? currentSessionSeconds : 0);
  const plannerTotal = plannerRecords.reduce((s, r) => s + (r.seconds || 0), 0);

  const recordDateMap = useMemo(() => {
    const obj = {};
    records.forEach((r) => {
      const key = getRecordStudyDate(r);
      obj[key] = (obj[key] || 0) + (r.seconds || 0);
    });
    return obj;
  }, [records]);

  const getMemberLiveSeconds = (member) => {
    if (!member?.studying) return 0;

    if (member.uid === uid) {
      return totalSec || 0;
    }

    if (member.liveStartedAtMs) {
      const baseSeconds = member.liveBaseSeconds || member.liveSeconds || 0;
      const elapsed = Math.floor((nowTick - member.liveStartedAtMs) / 1000);
      return Math.max(0, baseSeconds + elapsed);
    }

    return member.liveSeconds || 0;
  };

  const liveMembers = useMemo(() => {
    return members.map((m) => {
      const computedSeconds = getMemberLiveSeconds(m);

      if (m.uid !== uid) {
        return {
          ...m,
          liveSeconds: computedSeconds,
        };
      }

      return {
        ...m,
        displayName,
        subject,
        detail,
        studying,
        liveSeconds: computedSeconds,
        liveStudyDate: liveStudy?.studyDate || m.liveStudyDate,
      };
    });
  }, [members, uid, displayName, subject, detail, studying, totalSec, nowTick, liveStudy?.studyDate]);

  const getMemberTodaySavedSeconds = (member) => {
    if (!enteredGroupId || !member?.uid) return 0;

    return groupRecords
      .filter(
        (r) =>
          r.ownerUid === member.uid &&
          (r.sharedToGroups || []).includes(enteredGroupId) &&
          getRecordStudyDate(r) === today
      )
      .reduce((sum, r) => sum + (r.seconds || 0), 0);
  };

  const getMemberTodayTotalSeconds = (member) => {
    const liveStudyDate = member?.liveStudyDate || today;
    const liveSeconds = liveStudyDate === today ? getMemberLiveSeconds(member) : 0;
    return getMemberTodaySavedSeconds(member) + liveSeconds;
  };

  const groupTodayTotal = liveMembers.reduce(
    (sum, member) => sum + getMemberTodayTotalSeconds(member),
    0
  );

  const effectiveFlightNowTick = nowTick + devTimeOffsetSec * 1000;

  useEffect(() => {
    if (!studying || !activeFlight?.startedAtMs || !activeFlight?.minutes) {
      flightAutoLandingRef.current = false;
    inactiveAutoStopRef.current = false;
      return;
    }

    const requiredSeconds = Math.max(1, Number(activeFlight.minutes || 0) * 60);
    const elapsedSeconds = Math.max(
      0,
      Math.floor((effectiveFlightNowTick - activeFlight.startedAtMs) / 1000)
    );

    if (elapsedSeconds >= requiredSeconds && !flightAutoLandingRef.current) {
      flightAutoLandingRef.current = true;
      stopStudy({ autoLanding: true });
    }
  }, [studying, activeFlight?.startedAtMs, activeFlight?.minutes, effectiveFlightNowTick]);

  useEffect(() => {
    if (!studying || !liveStudy?.startedAtMs) {
      inactiveAutoStopRef.current = false;
      return;
    }

    const lastActiveAtMs = Number(liveStudy.lastActiveAtMs || liveStudy.updatedAtMs || liveStudy.startedAtMs || Date.now());
    const inactiveMs = Math.max(0, nowTick - lastActiveAtMs);

    if (inactiveMs > INACTIVE_AUTO_STOP_MS && !inactiveAutoStopRef.current) {
      inactiveAutoStopRef.current = true;
      stopStudy({
        autoInactive: true,
        forcedEndAtMs: Math.min(Date.now(), lastActiveAtMs + INACTIVE_AUTO_STOP_MS),
      });
    }
  }, [studying, liveStudy?.startedAtMs, liveStudy?.lastActiveAtMs, liveStudy?.updatedAtMs, nowTick]);

  const groupRankMembers = [...liveMembers].sort(
    (a, b) => getMemberTodayTotalSeconds(b) - getMemberTodayTotalSeconds(a)
  );

  const isMemberOnline = (member) => {
    if (!member) return false;
    if (member.uid === uid && enteredGroupId) return true;
    if (!member.lastSeenAtMs) return false;
    return nowTick - member.lastSeenAtMs < 65000;
  };

  const formatLastSeen = (member) => {
    if (isMemberOnline(member)) return "접속 중";
    if (!member?.lastSeenAtMs) return "접속 정보 없음";

    const diffSeconds = Math.max(0, Math.floor((nowTick - member.lastSeenAtMs) / 1000));
    if (diffSeconds < 60) return "방금 전 접속";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}분 전 접속`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전 접속`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전 접속`;
  };

  const formatDday = (date) => {
    if (!date) return "";
    const a = new Date(`${today}T00:00:00`);
    const b = new Date(`${date}T00:00:00`);
    const diff = Math.ceil((b - a) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "D-DAY";
    if (diff > 0) return `D-${diff}`;
    return `D+${Math.abs(diff)}`;
  };

  const getRecordHour = (time) => {
    const h = Number(String(time).split(":")[0]);
    if (Number.isNaN(h)) return "";
    return `${String(h).padStart(2, "0")}:00`;
  };

  const recordsByHour = (hour, list) =>
    list
      .filter((r) => getRecordHour(r.start) === hour)
      .sort((a, b) => studyOrderMinutes(a.start) - studyOrderMinutes(b.start));

  const sortStudyRecordsByTime = (list) =>
    [...list].sort((a, b) => studyOrderMinutes(a.start) - studyOrderMinutes(b.start));

  const taskTextKey = (record) =>
    `${String(record.subject || "과목 없음").trim()}::${String(record.detail || "세부 내용 없음").trim()}`;

  const taskColorKey = (record) => {
    if (record.kind === "meal") return "meal";

    // 색상은 subject/detail 전체가 아니라 화면에 보이는 TASK 한 묶음 기준으로 저장합니다.
    // 병합된 task는 mergedIds 묶음 하나가 같은 색을 쓰고,
    // 병합되지 않은 같은 내용의 다른 task는 서로 다른 색을 가질 수 있습니다.
    const ids = Array.isArray(record.mergedIds) && record.mergedIds.length
      ? record.mergedIds
      : [record.id || `${record.start}-${record.end}-${taskTextKey(record)}`];

    return `task::${ids.map(String).sort().join("|")}`;
  };

  const getTaskColorId = (record, fallbackIndex = 0) => {
    if (record.kind === "meal") return "meal";

    const saved = taskColorMap[taskColorKey(record)];
    if (saved && TIMETABLE_COLOR_PRESETS.some((preset) => preset.id === saved)) return saved;

    // 자동 색상도 subject/detail이 아니라 task 묶음 기준으로 계산합니다.
    // 그래서 병합되지 않은 같은 내용의 task가 무조건 같은 색으로 바뀌지 않습니다.
    const source = taskColorKey(record) || String(fallbackIndex);
    const hash = [...source].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    return TIMETABLE_COLOR_PRESETS[hash % TIMETABLE_COLOR_PRESETS.length].id;
  };

  const saveTaskColor = (record, colorId) => {
    const key = taskColorKey(record);
    const nextMap = { ...taskColorMap, [key]: colorId };

    setTaskColorMap(nextMap);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("studyRoomTaskColorMapV2", JSON.stringify(nextMap));
    }
  };

  const toggleTaskColorPickerVisible = () => {
    setTaskColorPickerVisible((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("studyRoomTaskColorPickerVisible", next ? "true" : "false");
      }
      return next;
    });
  };

  const renderTaskColorPicker = (record, compact = false) => {
    const selectedColorId = getTaskColorId(record);
    const selectedPreset =
      TIMETABLE_COLOR_PRESETS.find((preset) => preset.id === selectedColorId) ||
      TIMETABLE_COLOR_PRESETS[0];
    const selectedColor = darkMode ? selectedPreset.dark : selectedPreset.light;

    return (
      <div className={taskColorPickerVisible ? "task-color-picker open" : "task-color-picker"} title="타임테이블 형광펜 색깔 선택">
        <button
          type="button"
          className="task-color-toggle"
          onClick={toggleTaskColorPickerVisible}
        >
          <i style={{ background: selectedColor.bg, borderColor: selectedColor.border }} />
          {compact ? "색" : taskColorPickerVisible ? "색상 숨기기" : "색상"}
        </button>

        {taskColorPickerVisible && (
          <div className="task-color-palette">
            {TIMETABLE_COLOR_PRESETS.map((preset) => {
              const color = darkMode ? preset.dark : preset.light;
              const selected = selectedColorId === preset.id;

              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-label={`${preset.label} 색으로 표시`}
                  className={selected ? "task-color-dot selected" : "task-color-dot"}
                  style={{
                    width: compact ? 16 : 18,
                    height: compact ? 16 : 18,
                    background: color.bg,
                    borderColor: selected ? color.text : color.border,
                  }}
                  onClick={() => saveTaskColor(record, preset.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const mergeCloseTaskRecords = (list) => {
    const sorted = sortStudyRecordsByTime(list);
    const merged = [];

    sorted.forEach((record) => {
      const recordKey = taskTextKey(record);
      const recordStart = studyOrderMinutes(record.start);
      let recordEnd = studyOrderMinutes(record.end || record.start);

      if (recordEnd < recordStart) {
        recordEnd += 24 * 60;
      }

      if (recordEnd === recordStart && record.seconds) {
        recordEnd = recordStart + Math.max(0, Math.round(Number(record.seconds || 0) / 60));
      }

      const matchIndex = merged.findLastIndex((item) => {
        if (taskTextKey(item) !== recordKey) return false;

        const itemEnd = item.orderEndMinutes ?? studyOrderMinutes(item.end || item.start);
        const gapMinutes = recordStart - itemEnd;

        return gapMinutes >= 0 && gapMinutes <= 2;
      });

      if (matchIndex >= 0) {
        const target = merged[matchIndex];
        const nextEndMinutes = Math.max(target.orderEndMinutes || recordStart, recordEnd);

        target.end = record.end || target.end;
        target.orderEndMinutes = nextEndMinutes;
        target.seconds = (target.seconds || 0) + (record.seconds || 0);
        target.mergedIds = [...(target.mergedIds || [target.id]), record.id];

        // 병합된 뒤의 색상 키는 mergedIds 기준으로 다시 계산합니다.
        target.timeColorId = getTaskColorId(target);
      } else {
        const nextRecord = {
          ...record,
          orderEndMinutes: recordEnd,
          mergedIds: [record.id],
        };

        nextRecord.timeColorId = getTaskColorId(nextRecord);
        merged.push(nextRecord);
      }
    });

    return merged.sort((a, b) => studyOrderMinutes(a.start) - studyOrderMinutes(b.start));
  };

  const saveMealBlocks = (nextMealBlocks) => {
    setMealBlocks(nextMealBlocks);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("studyRoomMealBlocks", JSON.stringify(nextMealBlocks));
    }
  };

  const saveRecordDetailOnly = async (recordId) => {
    const nextDetail = editingRecordDetail.trim();

    if (!recordId || !nextDetail) {
      alert("수정할 내용을 입력해 주세요.");
      return;
    }

    try {
      await updateDoc(doc(db, "studyRecords", recordId), {
        detail: nextDetail,
        updatedAt: serverTimestamp(),
      });

      setEditingRecordId("");
      setEditingRecordDetail("");
    } catch (error) {
      console.error("공부 내용 수정 실패:", error);
      alert("공부 내용 수정 중 문제가 발생했습니다.");
    }
  };

  const addMealBlock = () => {
    if (!mealForm.start || !mealForm.end) {
      alert("식사 시작/종료 시간을 입력해 주세요.");
      return;
    }

    const nextMealBlocks = [
      ...mealBlocks,
      {
        id: `meal-${Date.now()}`,
        date: plannerDate,
        type: mealForm.type,
        start: mealForm.start,
        end: mealForm.end,
      },
    ].sort((a, b) => studyOrderMinutes(a.start) - studyOrderMinutes(b.start));

    saveMealBlocks(nextMealBlocks);
  };

  const removeMealBlock = (mealId) => {
    saveMealBlocks(mealBlocks.filter((meal) => meal.id !== mealId));
  };

  const updateCurrentFlightStudyInfo = async () => {
    if (!uid || !studying || !liveStudy?.studying) {
      alert("비행 중인 공부가 있을 때만 변경할 수 있습니다.");
      return;
    }

    const nextSubject = subject || "비행 집중";
    const nextDetail = detail.trim() || "비행 집중 공부";

    try {
      await setDoc(
        doc(db, "users", uid, "liveStudy", "current"),
        {
          subject: nextSubject,
          detail: nextDetail,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      if (enteredGroupId) {
        await setDoc(
          doc(db, "groups", enteredGroupId, "members", uid),
          {
            subject: nextSubject,
            detail: nextDetail,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      alert("비행 중 공부 과목/내용을 변경했습니다.");
    } catch (error) {
      console.error("비행 중 공부 정보 변경 실패:", error);
      alert("비행 중 공부 정보 변경 중 문제가 발생했습니다.");
    }
  };

  const groupedPlannerContents = (list) => {
    const map = new Map();

    list.forEach((record) => {
      const subjectName = String(record.subject || "과목 없음").trim() || "과목 없음";
      const detailText = String(record.detail || "세부 내용 없음").trim() || "세부 내용 없음";

      if (!map.has(subjectName)) {
        map.set(subjectName, new Set());
      }

      map.get(subjectName).add(detailText);
    });

    return Array.from(map.entries()).map(([subjectName, details]) => ({
      subject: subjectName,
      details: Array.from(details),
    }));
  };

  const getCalendarCells = () => {
    const y = calendarMonth.getFullYear();
    const m = calendarMonth.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const arr = [];

    for (let i = 0; i < first.getDay(); i++) arr.push(null);
    for (let d = 1; d <= last.getDate(); d++) {
      arr.push(`${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    }
    return arr;
  };

  const checkId = async () => {
    const id = normalizeId(signup.id);
    if (!id) {
      setIdCheck({ id: "", ok: false, msg: "아이디를 입력해 주세요." });
      return;
    }

    const snap = await getDoc(doc(db, "userIds", id));
    if (snap.exists()) {
      setIdCheck({ id, ok: false, msg: `${id}는 이미 사용 중입니다.` });
    } else {
      setIdCheck({ id, ok: true, msg: `${id}는 사용할 수 있습니다.` });
    }
  };

  const doSignup = async () => {
    try {
      const id = normalizeId(signup.id);
      const pw = normalizePw(signup.pw);
      const pw2 = normalizePw(signup.pw2);

      if (!id) throw new Error("아이디를 입력해 주세요.");
      if (idCheck.id !== id || !idCheck.ok) throw new Error("아이디 중복 확인을 해 주세요.");
      if (!pw || !pw2) throw new Error("비밀번호를 두 번 입력해 주세요.");
      if (pw.length < 6) throw new Error("비밀번호는 최소 6글자 이상이어야 합니다.");
      if (pw !== pw2) throw new Error("비밀번호가 서로 다릅니다.");

      const cred = await createUserWithEmailAndPassword(auth, loginEmail(id), pw);

      await setDoc(doc(db, "userIds", id), {
        uid: cred.user.uid,
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "users", cred.user.uid), {
        userId: id,
        displayName: id,
        bio: "",
        defaultGoal: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setAuthMsg("");
    } catch (e) {
      setAuthMsg(e.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  const doLogin = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        loginEmail(normalizeId(login.id)),
        normalizePw(login.pw)
      );
      setAuthMsg("");
    } catch {
      setAuthMsg("아이디 또는 비밀번호가 맞지 않습니다.");
    }
  };

  const openProfile = () => {
    setProfileForm({
      displayName: profile?.displayName || userId,
      bio: profile?.bio || "",
      defaultGoal: profile?.defaultGoal || "",
      newPw: "",
      newPw2: "",
    });
    setProfileMsg("");
    setProfileOpen(true);
  };

  const saveProfile = async () => {
    try {
      const newPw = normalizePw(profileForm.newPw);
      const newPw2 = normalizePw(profileForm.newPw2);

      if ((newPw || newPw2) && newPw !== newPw2) {
        throw new Error("새 비밀번호가 서로 다릅니다.");
      }
      if (newPw) {
        if (newPw.length < 6) throw new Error("비밀번호는 최소 6글자 이상이어야 합니다.");
        await updatePassword(user, newPw);
      }

      await updateDoc(doc(db, "users", uid), {
        displayName: profileForm.displayName.trim() || userId,
        bio: profileForm.bio.trim(),
        defaultGoal: profileForm.defaultGoal.trim(),
        updatedAt: serverTimestamp(),
      });

      setProfileMsg("저장되었습니다.");
    } catch (e) {
      setProfileMsg(e.message || "저장 중 오류가 발생했습니다.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setProfileOpen(false);
    setEnteredGroupId("");
    setSelectedGroupId("");
  };

  const randomCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length: 8 }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
  };

  const generateRoomCode = async () => {
    let code = "";
    let exists = true;
    let count = 0;

    while (exists) {
      code = randomCode();
      count += 1;
      const snap = await getDoc(doc(db, "roomCodes", code));
      exists = snap.exists();
    }

    setPendingCode(code);
    setCodeMsg(
      `중복 확인 완료: ${code}는 사용 가능해. ${
        count > 1 ? `${count}번 확인했습니다.` : "한 번에 생성되었습니다."
      }`
    );
    return code;
  };

  const createGroup = async () => {
    try {
      const name = createRoom.name.trim();
      const description = createRoom.description.trim() || "새로 만든 스터디 그룹";
      const goal = createRoom.goal.trim() || "오늘 목표를 정해 보세요";
      const password = normalizeRoomPw(createRoom.password);

      if (!name) throw new Error("방 이름을 입력해 주세요.");
      if (!/^[0-9]{8}$/.test(password)) throw new Error("비밀번호는 숫자 8개여야 합니다.");

      const code = pendingCode || (await generateRoomCode());
      const codeSnap = await getDoc(doc(db, "roomCodes", code));
      if (codeSnap.exists()) throw new Error("방 ID가 이미 있습니다. 다시 생성해 주세요.");

      const groupRef = await addDoc(collection(db, "groups"), {
        name,
        description,
        goal,
        roomCode: code,
        password,
        privacy: "private",
        ownerUid: uid,
        ownerUserId: userId,
        memberUids: [uid],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await setDoc(doc(db, "roomCodes", code), {
        groupId: groupRef.id,
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "groups", groupRef.id, "members", uid), {
        uid,
        userId,
        displayName,
        role: "방장",
        subject,
        detail,
        studying: false,
        liveSeconds: 0,
        lastSeenAtMs: Date.now(),
        lastSeenLabel: nowTime(),
        joinedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "groups", groupRef.id, "messages"), {
        senderUid: uid,
        senderName: displayName,
        text: "스터디 그룹을 만들었습니다.",
        createdAt: serverTimestamp(),
      });

      setSelectedGroupId(groupRef.id);
      setEnteredGroupId(groupRef.id);
      setCreateOpen(false);
      setPendingCode("");
      setCodeMsg("");
      setCreateRoom({ name: "", description: "", goal: "", password: "" });
      setGroupMsg(`방이 생성되었습니다. 방 ID는 ${code}입니다.`);
    } catch (e) {
      setGroupMsg(e.message || "방 생성 중 오류가 발생했습니다.");
    }
  };

  const joinGroup = async () => {
    try {
      const code = normalizeRoomCode(joinRoom.code);
      const password = normalizeRoomPw(joinRoom.password);

      if (!/^[A-Z]{8}$/.test(code)) throw new Error("방 ID는 영어 대문자 8자입니다.");
      if (!/^[0-9]{8}$/.test(password)) throw new Error("비밀번호는 숫자 8개입니다.");

      const codeSnap = await getDoc(doc(db, "roomCodes", code));
      if (!codeSnap.exists()) throw new Error("해당 방 ID를 찾을 수 없습니다.");

      const groupId = codeSnap.data().groupId;
      const groupSnap = await getDoc(doc(db, "groups", groupId));
      if (!groupSnap.exists()) throw new Error("방 정보를 찾을 수 없습니다.");

      const group = { id: groupId, ...groupSnap.data() };
      if (group.password !== password) throw new Error("방 ID 또는 비밀번호가 틀렸습니다.");

      const bannedUids = group.bannedUids || [];
      const bannedMembers = group.bannedMembers || {};
      if (bannedUids.includes(uid) || bannedMembers[uid]) {
        throw new Error("방장에 의해 추방된 계정입니다. 방장이 재입장을 허용해야 다시 입장할 수 있습니다.");
      }

      const nextMembers = Array.from(new Set([...(group.memberUids || []), uid]));

      await updateDoc(doc(db, "groups", groupId), {
        memberUids: nextMembers,
        updatedAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "groups", groupId, "members", uid),
        {
          uid,
          userId,
          displayName,
          role: group.ownerUid === uid ? "방장" : "참여자",
          subject,
          detail,
          studying: false,
          liveSeconds: 0,
          lastSeenAtMs: Date.now(),
          lastSeenLabel: nowTime(),
          joinedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSelectedGroupId(groupId);
      setEnteredGroupId(groupId);
      setJoinRoom({ code: "", password: "" });
      setGroupMsg(`${group.name}에 입장했습니다.`);
    } catch (e) {
      setGroupMsg(e.message || "방 입장 중 오류가 발생했습니다.");
    }
  };

  const deleteGroup = async (group) => {
  if (!group) return;

  if (group.ownerUid !== uid) {
    alert("방장만 방을 삭제할 수 있습니다.");
    return;
  }

  const ok = window.confirm(
    `정말 "${group.name}" 방을 삭제하시겠습니까?\n\n삭제하면 방 정보, 그룹원 정보, 채팅 기록이 삭제되며 되돌릴 수 없습니다.`
  );

  if (!ok) return;

  try {
    const membersSnap = await getDocs(collection(db, "groups", group.id, "members"));
    await Promise.all(membersSnap.docs.map((memberDoc) => deleteDoc(memberDoc.ref)));

    const messagesSnap = await getDocs(collection(db, "groups", group.id, "messages"));
    await Promise.all(messagesSnap.docs.map((messageDoc) => deleteDoc(messageDoc.ref)));

    if (group.roomCode) {
      await deleteDoc(doc(db, "roomCodes", group.roomCode));
    }

    await deleteDoc(doc(db, "groups", group.id));

    if (enteredGroupId === group.id) {
      setEnteredGroupId("");
    }

    if (selectedGroupId === group.id) {
      setSelectedGroupId("");
    }

    setGroupMsg(`"${group.name}" 방을 삭제했습니다.`);
  } catch (error) {
    console.error(error);
    setGroupMsg("방 삭제 중 오류가 발생했습니다.");
  }
};
  const kickMember = async (group, member) => {
    if (!group || !member) return;

    if (group.ownerUid !== uid) {
      alert("방장만 멤버를 추방할 수 있습니다.");
      return;
    }

    if (member.uid === uid) {
      alert("방장은 자기 자신을 추방할 수 없습니다.");
      return;
    }

    const memberName = member.displayName || member.userId || "선택한 멤버";
    const ok = window.confirm(
      `정말 "${memberName}"님을 이 방에서 추방하시겠습니까?\n\n추방된 멤버는 방장이 재입장을 허용하기 전까지 방 ID와 비밀번호를 입력해도 다시 입장할 수 없습니다.`
    );

    if (!ok) return;

    try {
      const nextMembers = (group.memberUids || []).filter((memberUid) => memberUid !== member.uid);
      const nextBannedUids = Array.from(new Set([...(group.bannedUids || []), member.uid]));
      const nextBannedMembers = {
        ...(group.bannedMembers || {}),
        [member.uid]: {
          uid: member.uid,
          userId: member.userId || "",
          displayName: memberName,
          role: member.role || "참여자",
          bannedAtMs: Date.now(),
          bannedAtLabel: nowTime(),
          bannedByUid: uid,
          bannedByName: displayName,
        },
      };

      await updateDoc(doc(db, "groups", group.id), {
        memberUids: nextMembers,
        bannedUids: nextBannedUids,
        bannedMembers: nextBannedMembers,
        updatedAt: serverTimestamp(),
      });

      await deleteDoc(doc(db, "groups", group.id, "members", member.uid));

      setGroupMsg(`"${memberName}"님을 방에서 추방했습니다. 방장이 재입장을 허용해야 다시 입장할 수 있습니다.`);
    } catch (error) {
      console.error(error);
      setGroupMsg("멤버 추방 중 오류가 발생했습니다.");
    }
  };

  const allowMemberReentry = async (group, bannedMember) => {
    if (!group || !bannedMember) return;

    if (group.ownerUid !== uid) {
      alert("방장만 재입장을 허용할 수 있습니다.");
      return;
    }

    const memberName = bannedMember.displayName || bannedMember.userId || "선택한 멤버";
    const ok = window.confirm(
      `"${memberName}"님의 재입장을 허용하시겠습니까?\n\n허용 후에는 해당 멤버가 방 ID와 비밀번호를 입력하면 다시 입장할 수 있습니다.`
    );

    if (!ok) return;

    try {
      const nextBannedUids = (group.bannedUids || []).filter((memberUid) => memberUid !== bannedMember.uid);
      const nextBannedMembers = { ...(group.bannedMembers || {}) };
      delete nextBannedMembers[bannedMember.uid];

      await updateDoc(doc(db, "groups", group.id), {
        bannedUids: nextBannedUids,
        bannedMembers: nextBannedMembers,
        updatedAt: serverTimestamp(),
      });

      setGroupMsg(`"${memberName}"님의 재입장을 허용했습니다. 이제 방 ID와 비밀번호로 다시 입장할 수 있습니다.`);
    } catch (error) {
      console.error(error);
      setGroupMsg("재입장 허용 중 오류가 발생했습니다.");
    }
  };

  const addSubject = () => {
    const value = newSubject.trim();
    if (!value || studying) return;
    if (!subjects.includes(value)) setSubjects((prev) => [...prev, value]);
    setSubject(value);
    setNewSubject("");
  };

  const startStudy = async () => {
    if (!subject || !detail.trim()) {
      alert("과목과 자세한 공부 내용을 입력해 주세요.");
      return;
    }

    if (!uid) {
      alert("로그인 정보가 확인되지 않았습니다. 다시 로그인해 주세요.");
      return;
    }

    const startMs = Date.now();
    const startLabel = nowTime();
    const startStudyDate = studyDayString(new Date(startMs));
    const sessionId = `${uid}-${startMs}`;
    const liveStudyRef = doc(db, "users", uid, "liveStudy", "current");

    await setDoc(
      liveStudyRef,
      {
        studying: true,
        sessionId,
        subject,
        detail,
        startedAtMs: startMs,
        startedAtLabel: startLabel,
        baseSeconds: 0,
        studyDate: startStudyDate,
        lastActiveAtMs: startMs,
        lastActiveLabel: startLabel,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setStudying(true);
    setStartedAt(startLabel);
    setSessionSec(0);
    setTotalSec(0);
    setUnread(0);

    if (enteredGroupId) {
      try {
        await setDoc(
          doc(db, "groups", enteredGroupId, "members", uid),
          {
            uid,
            userId,
            displayName,
            role: currentGroup?.ownerUid === uid ? "방장" : "참여자",
            subject,
            detail,
            studying: true,
            liveStartedAtMs: startMs,
            liveBaseSeconds: 0,
            liveSeconds: 0,
            liveStudyDate: startStudyDate,
            lastSeenAtMs: Date.now(),
            lastSeenLabel: nowTime(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("그룹 상태 업데이트 실패:", error);
      }
    }
  };

  const stopStudy = async (options = {}) => {
    if (!uid) return;

    const effectiveEndAtMs = Number(options.forcedEndAtMs || Date.now());
    const end = timeLabelFromMs(effectiveEndAtMs);
    const liveStudyRef = doc(db, "users", uid, "liveStudy", "current");
    const recordRef = doc(collection(db, "studyRecords"));

    let result = null;

    try {
      result = await runTransaction(db, async (transaction) => {
        const liveSnap = await transaction.get(liveStudyRef);

        if (!liveSnap.exists()) {
          return { saved: false, reason: "no-live-study" };
        }

        const data = liveSnap.data();

        if (!data.studying) {
          return { saved: false, reason: "already-stopped" };
        }

        const liveSubject = data.subject || subject;
        const liveDetail = data.detail || detail;
        const liveStartedAt = data.startedAtLabel || startedAt || "시작 시간 없음";
        const recordStudyDate = data.studyDate || studyDayString(data.startedAtMs ? new Date(data.startedAtMs) : new Date());
        const rawFinalSeconds = data.startedAtMs
          ? Math.max(
              0,
              (data.baseSeconds || 0) +
                Math.floor((effectiveEndAtMs - data.startedAtMs) / 1000)
            )
          : sessionSec;

        const finalSeconds = options.autoInactive
          ? Math.min(rawFinalSeconds, Math.ceil(INACTIVE_AUTO_STOP_MS / 1000))
          : rawFinalSeconds;

        if (finalSeconds > 0) {
          transaction.set(recordRef, {
            ownerUid: uid,
            ownerUserId: userId,
            ownerName: displayName,
            date: recordStudyDate,
            studyDate: recordStudyDate,
            subject: liveSubject,
            detail: liveDetail,
            seconds: finalSeconds,
            start: liveStartedAt,
            end,
            sharedToGroups: groups.map((g) => g.id),
            liveStudySessionId: data.sessionId || null,
            createdAt: serverTimestamp(),
          });
        }

        transaction.set(
          liveStudyRef,
          {
            studying: false,
            subject: liveSubject,
            detail: liveDetail,
            baseSeconds: 0,
            startedAtMs: null,
            startedAtLabel: null,
            stoppedAtLabel: end,
            studyDate: null,
            lastSessionSeconds: finalSeconds,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        return {
          saved: finalSeconds > 0,
          finalSeconds,
          subject: liveSubject,
          detail: liveDetail,
        };
      });
    } catch (error) {
      console.error("순공 종료 저장 실패:", error);
      alert("순공 기록 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    if (enteredGroupId) {
      await setDoc(
        doc(db, "groups", enteredGroupId, "members", uid),
        {
          studying: false,
          liveSeconds: 0,
          liveBaseSeconds: 0,
          liveStartedAtMs: null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    if (result?.saved && activeFlight?.fromCode && activeFlight?.toCode) {
      const rewardFrom = FLIGHT_COUNTRIES.find((c) => c.code === activeFlight.fromCode);
      const rewardTo = FLIGHT_COUNTRIES.find((c) => c.code === activeFlight.toCode);
      const requiredFlightSeconds = Math.max(1, Number(activeFlight.minutes || 0) * 60);
      const completedFlight = (result.finalSeconds || 0) >= requiredFlightSeconds;

      if (completedFlight) {
        const earnedMiles = Math.max(
          1,
          Math.floor((result.finalSeconds || 0) / 60) * FLIGHT_MILES_PER_MINUTE
        );

        const nextTotalFlightMilesEarned = saveTotalFlightMilesEarned(totalFlightMilesEarned + earnedMiles);
        const nextStdrAirTier = getStdrAirTier(nextTotalFlightMilesEarned);

        saveFlightMiles(flightMiles + earnedMiles);
        const nextStamps = addPassportStamp({
          from: rewardFrom,
          to: rewardTo,
          seconds: result.finalSeconds || 0,
          milesEarned: earnedMiles,
        });

        setArrivalReward({
          from: rewardFrom,
          to: rewardTo,
          seconds: result.finalSeconds || 0,
          milesEarned: earnedMiles,
          totalMiles: flightMiles + earnedMiles,
          totalFlightMilesEarned: nextTotalFlightMilesEarned,
          airlineTier: nextStdrAirTier.current,
          nextAirlineTier: nextStdrAirTier.next,
          airlineTierProgress: nextStdrAirTier.progress,
          stampCount: nextStamps.length,
          title: options.autoLanding
            ? `${flightRewardTitle(rewardTo)} · 자동 착륙`
            : options.autoInactive
              ? `${flightRewardTitle(rewardTo)} · 미접속 자동 종료`
              : flightRewardTitle(rewardTo),
        });
      } else {
        setGroupMsg(
          `비행 시간이 부족해서 여권 도장이 찍히지 않았습니다. 필요 시간: ${formatFlightTime(Math.ceil(requiredFlightSeconds / 60))}`
        );
      }
    }

    setStudying(false);
    setStartedAt(null);
    setSessionSec(0);
    setTotalSec(0);
    setUnread(0);
    setPlannerDate(today);
    setActiveFlight(null);
    setFlightTicketCutting(false);
    setFlightTicketUsed(false);
    flightAutoLandingRef.current = false;

    if (options.autoInactive && result?.saved) {
      setGroupMsg("5시간 이상 미접속으로 순공이 자동 종료되었습니다. 인정된 시간 기준으로 보상이 처리되었습니다.");
    }

    if (result?.reason === "already-stopped") {
      setGroupMsg("이미 다른 기기에서 순공이 종료되었습니다.");
    }
  };

  const sendMessage = async () => {
    const messageText = chatText.trim();

    if (!enteredGroupId || !messageText || studying || chatSendingRef.current) return;

    chatSendingRef.current = true;
    setChatText("");

    try {
      await addDoc(collection(db, "groups", enteredGroupId, "messages"), {
        senderUid: uid,
        senderName: displayName,
        text: messageText,
        clientMessageId: `${uid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      setChatText(messageText);
    } finally {
      window.setTimeout(() => {
        chatSendingRef.current = false;
      }, 450);
    }
  };

  const saveMemo = async (date, text) => {
    setMemos((prev) => ({ ...prev, [date]: text }));
    await setDoc(
      doc(db, "users", uid, "plannerMemos", date),
      { text, updatedAt: serverTimestamp() },
      { merge: true }
    );
  };

  const loadWeather = () => {
    const geo = typeof window !== "undefined" && window.navigator && window.navigator.geolocation;

    if (!geo) {
      setWeatherMsg("이 브라우저에서는 위치 기반 날씨를 지원하지 않습니다.");
      return;
    }

    setWeatherLoading(true);
    setWeatherMsg("현재 위치를 확인하고 있습니다.");

    geo.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const url =
            "https://api.open-meteo.com/v1/forecast?latitude=" +
            latitude +
            "&longitude=" +
            longitude +
            "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max" +
            "&forecast_days=7&timezone=auto";

          const response = await fetch(url);
          if (!response.ok) throw new Error("weather-fetch-failed");

          const data = await response.json();
          const daily = data.daily || {};
          const times = Array.isArray(daily.time) ? daily.time : [];

          const nextDays = times.slice(0, 7).map((date, index) => {
            const codeList = daily.weather_code || [];
            const maxList = daily.temperature_2m_max || [];
            const minList = daily.temperature_2m_min || [];
            const rainList = daily.precipitation_probability_max || [];
            const rainAmountList = daily.precipitation_sum || [];
            const windList = daily.wind_speed_10m_max || [];

            return {
              date,
              label: weatherDayLabel(date, index),
              code: codeList[index],
              weather: weatherLabel(codeList[index]),
              max: Math.round(Number(maxList[index] ?? 0)),
              min: Math.round(Number(minList[index] ?? 0)),
              rain: rainList[index] ?? "-",
              rainAmount: Number(rainAmountList[index] ?? 0),
              wind: Math.round(Number(windList[index] ?? 0)),
            };
          });

          const rainyDays = nextDays.filter((day) => {
            const rainPercent = Number(day.rain);
            return rainPercent >= 50 || (rainPercent >= 30 && day.rainAmount >= 3);
          });

          setWeatherDays(nextDays);

          if (rainyDays.length) {
            const umbrellaText = rainyDays
              .map((day) => `${day.label}(${day.rain}%·${day.rainAmount.toFixed(1)}mm)`)
              .join(", ");
            setWeatherMsg("현재 위치 기준 7일 예보입니다. 비 가능성이 있는 날은 아래에서 강조됩니다.");
            setWeatherToast(`우산 추천: ${umbrellaText}에 비 가능성이 있습니다.`);
          } else {
            setWeatherMsg("현재 위치 기준 7일 예보입니다. 일주일 안에는 우산이 꼭 필요할 정도의 비 가능성이 낮습니다.");
            setWeatherToast("이번 주는 우산이 꼭 필요할 정도의 비 가능성이 낮습니다.");
          }
        } catch (error) {
          console.error(error);
          setWeatherMsg("날씨를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        } finally {
          setWeatherLoading(false);
        }
      },
      () => {
        setWeatherLoading(false);
        setWeatherMsg("위치 권한을 허용해야 날씨를 볼 수 있습니다.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 * 60 * 20 }
    );
  };

  const openNewDday = () => {
    setEditingDdayId("");
    setDdayForm({
      title: "",
      date: today,
      category: "시험",
      priority: "보통",
      memo: "",
    });
    setDdayOpen(true);
  };

  const openEditDday = (d) => {
    setEditingDdayId(d.id);
    setDdayForm({
      title: d.title || "",
      date: d.date || today,
      category: d.category || "시험",
      priority: d.priority || "보통",
      memo: d.memo || "",
    });
    setDdayOpen(true);
  };

  const saveDday = async () => {
    const title = ddayForm.title.trim();
    if (!title || !ddayForm.date) return;

    if (editingDdayId) {
      await setDoc(
        doc(db, "users", uid, "ddays", editingDdayId),
        { ...ddayForm, title, updatedAt: serverTimestamp() },
        { merge: true }
      );
    } else {
      const ref = await addDoc(collection(db, "users", uid, "ddays"), {
        ...ddayForm,
        title,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSelectedDdayId(ref.id);
      setPlannerDdayId(ref.id);
      setEditingDdayId(ref.id);
    }
  };

  const deleteDday = async (id) => {
    await deleteDoc(doc(db, "users", uid, "ddays", id));
  };

  const moveMonth = (amount) => {
    setCalendarMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + amount, 1)
    );
  };


  const renderRoomInfoCard = (compact = false) => {
    if (!currentGroup) return null;

    return (
      <section
        style={{
          ...S.card,
          padding: compact ? 12 : 14,
          marginBottom: compact ? 10 : 12,
          border: "1px solid var(--border-soft)",
        }}
      >
        <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>현재 방 정보</div>
        <h2 style={{ margin: "4px 0 8px", fontSize: compact ? 18 : 20 }}>
          {currentGroup.name || "스터디 방"}
        </h2>
        <div style={{ display: "grid", gap: 8 }}>
          <div
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: compact ? 9 : 10,
            }}
          >
            <b style={{ display: "block", fontSize: 12, color: "var(--text-mid)" }}>방 설명</b>
            <p style={{ ...S.small, margin: "4px 0 0", lineHeight: 1.45 }}>
              {currentGroup.description || "아직 방 설명이 없습니다."}
            </p>
          </div>
          <div
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: compact ? 9 : 10,
            }}
          >
            <b style={{ display: "block", fontSize: 12, color: "var(--text-mid)" }}>방 목표</b>
            <p style={{ ...S.small, margin: "4px 0 0", lineHeight: 1.45 }}>
              {currentGroup.goal || "아직 방 목표가 없습니다."}
            </p>
          </div>
        </div>
      </section>
    );
  };

  const renderGroupRankCard = () => {
    return (
      <section style={{ ...S.card, padding: 14, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <div>
            <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>그룹원 현황 및 랭킹</div>
            <h2 style={{ margin: "2px 0 0", fontSize: 20 }}>그룹 오늘 합계</h2>
            <p style={{ ...S.small, margin: "4px 0 0" }}>
              공부 기준일은 06:00부터 다음 날 06:00까지입니다.
            </p>
          </div>
          <div style={{ textAlign: easyLayout ? "left" : "right", width: easyLayout ? "100%" : "auto" }}>
            <b style={{ color: "var(--text-main)", display: "block" }}>{formatTimer(groupTodayTotal)}</b>
            <div style={{ ...S.small, fontSize: 10 }}>
              <span style={{ color: "#22c55e", fontWeight: 900 }}>●</span> 접속 중
              <span style={{ color: "#cbd5e1", fontWeight: 900, marginLeft: 8 }}>●</span> 미접속
            </div>
          </div>
        </div>

        <div style={{ marginTop: 10, maxHeight: 390, overflowY: "auto" }}>
          {groupRankMembers.length ? (
            groupRankMembers.map((m, idx) => {
              const todaySeconds = getMemberTodayTotalSeconds(m);
              const savedSeconds = getMemberTodaySavedSeconds(m);
              const liveSeconds = (m.liveStudyDate || today) === today ? getMemberLiveSeconds(m) : 0;

              return (
                <div
                  key={m.uid}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "28px minmax(0, 1fr) auto",
                    gap: 8,
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border-soft)",
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 8,
                      background: idx === 0 ? (darkMode ? "rgba(234,179,8,0.18)" : "#fff7d6") : "var(--input-bg)",
                      color: idx === 0 ? "#f59f00" : "var(--text-sub)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 950,
                      fontSize: 12,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                      <b style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {m.displayName || m.userId}
                      </b>
                      <span
                        title={formatLastSeen(m)}
                        style={{
                          flex: "0 0 auto",
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: isMemberOnline(m) ? "#22c55e" : "#cbd5e1",
                          boxShadow: isMemberOnline(m) ? "0 0 0 3px rgba(34,197,94,0.14)" : "none",
                        }}
                      />
                    </div>
                    <span style={{ ...S.small, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {m.studying
                        ? `공부 중 · ${m.subject || "과목 없음"} · ${isMemberOnline(m) ? "접속 중" : formatLastSeen(m)}`
                        : `휴식 · ${formatLastSeen(m)}`}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <b>{formatTimer(todaySeconds)}</b>
                    <div style={{ ...S.small, fontSize: 10 }}>
                      저장 {formatStudy(savedSeconds)}{liveSeconds > 0 ? ` · 진행 ${formatStudy(liveSeconds)}` : ""}
                    </div>
                    {currentGroup?.ownerUid === uid && m.uid !== uid && (
                      <button
                        type="button"
                        onClick={() => kickMember(currentGroup, m)}
                        style={{
                          marginTop: 6,
                          border: "1px solid #fecaca",
                          background: darkMode ? "rgba(127,29,29,0.28)" : "#fff1f2",
                          color: "#dc2626",
                          borderRadius: 10,
                          padding: "5px 8px",
                          fontSize: 11,
                          fontWeight: 900,
                          cursor: "pointer",
                        }}
                      >
                        추방
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p style={S.small}>아직 그룹원이 없습니다.</p>
          )}
        </div>
      </section>
    );
  };

  const startFlightStudy = async () => {
    const from = FLIGHT_COUNTRIES.find((c) => c.code === flightFromCode);
    const to = FLIGHT_COUNTRIES.find((c) => c.code === flightToCode);

    if (!from || !to || from.code === to.code) {
      alert("출발 국가와 도착 국가는 서로 다르게 선택해 주세요.");
      return;
    }

    if (!isFlightCountryUnlocked(from.code) || !isFlightCountryUnlocked(to.code)) {
      alert("잠긴 국가는 비행할 수 없습니다. 비행 마일리지로 먼저 해금해 주세요.");
      return;
    }

    if (!uid) {
      alert("로그인 정보가 확인되지 않았습니다. 다시 로그인해 주세요.");
      return;
    }

    if (studying) {
      alert("이미 공부 측정 중입니다. 현재 세션을 종료한 뒤 비행을 시작해 주세요.");
      return;
    }

    const flightSubject = subject || "비행 집중";
    const flightDetail = getFlightDetailText(from.code, to.code);
    const startMs = Date.now();
    const startLabel = nowTime();
    const startStudyDate = studyDayString(new Date(startMs));
    const sessionId = `${uid}-${startMs}`;
    const liveStudyRef = doc(db, "users", uid, "liveStudy", "current");

    setSubject(flightSubject);
    setDetail(flightDetail);
    setFlightTicketUsed(true);
    setFlightTicketCutting(true);
    flightAutoLandingRef.current = false;

    window.setTimeout(async () => {
      await setDoc(
        liveStudyRef,
        {
          studying: true,
          sessionId,
          subject: flightSubject,
          detail: flightDetail,
          startedAtMs: startMs,
          startedAtLabel: startLabel,
          baseSeconds: 0,
          studyDate: startStudyDate,
          lastActiveAtMs: startMs,
          lastActiveLabel: startLabel,
          updatedAt: serverTimestamp(),
          flight: {
            fromCode: from.code,
            fromName: from.name,
            fromCity: from.city,
            toCode: to.code,
            toName: to.name,
            toCity: to.city,
            minutes: routeFlightMinutes(from, to),
            distanceKm: routeDistanceKm(from, to),
          },
        },
        { merge: true }
      );

      setStudying(true);
      setStartedAt(startLabel);
      setSessionSec(0);
      setTotalSec(0);
      setUnread(0);
      setActiveFlight({
        fromCode: from.code,
        fromName: from.name,
        fromCity: from.city,
        toCode: to.code,
        toName: to.name,
        toCity: to.city,
        minutes: routeFlightMinutes(from, to),
        distanceKm: routeDistanceKm(from, to),
        startedAt: startLabel,
        startedAtMs: startMs,
      });

      if (enteredGroupId) {
        try {
          await setDoc(
            doc(db, "groups", enteredGroupId, "members", uid),
            {
              uid,
              userId,
              displayName,
              role: currentGroup?.ownerUid === uid ? "방장" : "참여자",
              subject: flightSubject,
              detail: flightDetail,
              studying: true,
              liveSessionId: sessionId,
              liveStartedAtMs: startMs,
              liveStudyDate: startStudyDate,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (error) {
          console.error("비행 공부 그룹 상태 업데이트 실패:", error);
        }
      }

      setFlightTicketCutting(false);
    }, 900);
  };

  const renderFlightModeUi = () => {
    const activeFromCode = activeFlight?.fromCode || flightFromCode;
    const activeToCode = activeFlight?.toCode || flightToCode;
    const from = FLIGHT_COUNTRIES.find((c) => c.code === activeFromCode) || FLIGHT_COUNTRIES[0];
    const to = FLIGHT_COUNTRIES.find((c) => c.code === activeToCode) || FLIGHT_COUNTRIES[1];
    const distance = routeDistanceKm(from, to);
    const minutes = routeFlightMinutes(from, to);
    const activeMinutes = activeFlight?.minutes || minutes;
    const liveElapsedSeconds =
      studying && activeFlight?.startedAtMs
        ? Math.max(0, Math.floor((effectiveFlightNowTick - activeFlight.startedAtMs) / 1000))
        : currentSessionSeconds;
    const flightProgress = studying && activeFlight
      ? Math.min(100, Math.round((liveElapsedSeconds / Math.max(1, activeMinutes * 60)) * 100))
      : 0;
    const flightInProgress = studying && activeFlight;
    const effectiveFlightMapZoom = flightMapZoom;
    const visibleCountries = FLIGHT_COUNTRIES.filter((country) => isFlightCountryUnlocked(country.code) || !flightInProgress);
    const lockedCountries = FLIGHT_COUNTRIES.filter((country) => !isFlightCountryUnlocked(country.code));
    const nextUnlockCountries = lockedCountries
      .map((country) => ({ country, cost: flightUnlockCost(country) }))
      .sort((a, b) => a.cost - b.cost)
      .slice(0, 8);

    const route = buildVisibleFlightRoute(from, to, 96);
    const progressIndex = Math.min(
      route.points.length - 1,
      Math.max(0, Math.round(((studying && activeFlight ? flightProgress : 0) / 100) * (route.points.length - 1)))
    );
    const planePoint = route.points[progressIndex] || route.points[0];
    const nextPoint = route.points[Math.min(route.points.length - 1, progressIndex + 1)] || planePoint;
    const planeRotate = Math.atan2(nextPoint.y - planePoint.y, nextPoint.x - planePoint.x) * (180 / Math.PI);

    const chooseCountryOnMap = (country) => {
      if (studying || flightTicketCutting) return;

      if (!isFlightCountryUnlocked(country.code)) {
        unlockFlightCountry(country);
        return;
      }

      if (flightPickTarget === "from") {
        if (country.code === flightToCode) {
          alert("출발 국가와 도착 국가는 서로 달라야 합니다.");
          return;
        }

        setFlightFromCode(country.code);
        applyFlightDetailByCodes(country.code, flightToCode);
        setFlightPickTarget("to");
        return;
      }

      if (country.code === flightFromCode) {
        alert("출발 국가와 도착 국가는 서로 달라야 합니다.");
        return;
      }

      setFlightToCode(country.code);
      applyFlightDetailByCodes(flightFromCode, country.code);
    };

    return (
      <section
        className={[
          "flight-dashboard-card",
          flightInProgress ? "tracking-flight" : "",
          `stdr-tier-${selectedStdrThemeId}`,
        ].filter(Boolean).join(" ")}
        style={{
          "--stdr-tier-accent": selectedStdrThemeStyle.accent,
          "--stdr-tier-accent-2": selectedStdrThemeStyle.accent2,
          "--stdr-plane-color": stdrAirTierStyle.plane,
          "--stdr-stamp-color": selectedStdrThemeStyle.stamp || selectedStdrThemeStyle.accent,
          "--stdr-ticket-bg": selectedStdrThemeStyle.ticketBg,
          "--stdr-ticket-text": selectedStdrThemeStyle.ticketText,
          "--stdr-passport-bg": selectedStdrThemeStyle.passportBg,
          "--stdr-reward-bg": stdrAirTierStyle.rewardBg,
        }}
      >
        <div className="flight-dashboard-head">
          <div>
            <div className="flight-kicker">FLIGHT STUDY MODE</div>
            <h2>비행기 모드</h2>
            <p>세계지도에서 출발지와 도착지를 직접 선택하면, 공부 시간 동안 비행기가 경로를 따라 이동합니다.</p>
          </div>

          <div className="flight-route-summary">
            <span>{from.code}</span>
            <b>→</b>
            <span>{to.code}</span>
            <small>{distance.toLocaleString()}km · 예상 {formatFlightTime(minutes)}</small>
            <button
              type="button"
              className="flight-fullscreen-open"
              onClick={() => setFlightFullscreenOpen(true)}
            >
              전체화면 모드
            </button>
          </div>
        </div>

        <div className="flight-mileage-panel">
          <div className="flight-mileage-card">
            <span>FLIGHT MILEAGE</span>
            <b>{flightMiles.toLocaleString()}M</b>
            <small>{flightProfileLoaded ? "서버 저장됨" : "서버 동기화 중"} · 공부 1분당 {FLIGHT_MILES_PER_MINUTE}마일</small>
          </div>
          <div className={`flight-mileage-card stdr-air-tier-card stdr-class-${stdrAirTier.current.id}`}>
            <span>STDR AIR CLASS</span>
            <b>{stdrAirTier.current.label}</b>
            <small>등급 해금은 사용 후 남은 마일이 아니라 누적 획득 마일리지 기준입니다.</small>
            <div className="stdr-class-mile-grid">
              <div>
                <span>누적 마일리지</span>
                <strong>{totalFlightMilesEarned.toLocaleString()}M</strong>
              </div>
              <div>
                <span>다음 등급</span>
                <strong>{stdrAirTier.next ? `${stdrAirTier.remaining.toLocaleString()}M 남음` : "최고 등급"}</strong>
              </div>
            </div>
            <div className="stdr-tier-progress">
              <i style={{ width: `${stdrAirTier.progress}%` }} />
            </div>
            <button type="button" className="stdr-tier-preview-button" onClick={() => setTierPreviewOpen(true)}>
              등급 디자인 미리보기
            </button>
          </div>
          <div className="flight-mileage-card flight-passport-card">
            <span>PASSPORT</span>
            <b>{passportStamps.length} STAMPS</b>
            <small>{getPassportStats().length}개 국가 스탬프 보유</small>
            <button type="button" className="passport-open-button" onClick={() => setPassportOpen(true)}>
              여권 열기
            </button>
          </div>
          <div className="flight-unlock-box">
            <div className="flight-unlock-box-head">
              <span>잠긴 여행지</span>
              <button type="button" onClick={() => setUnlockListOpen(true)}>
                자세히 보기
              </button>
            </div>
            <div className="flight-unlock-strip">
              {nextUnlockCountries.map(({ country, cost }) => (
                <button
                  key={country.code}
                  type="button"
                  disabled={flightMiles < cost}
                  onClick={() => unlockFlightCountry(country)}
                  title={`${country.name} 해금`}
                >
                  <b>{country.code}</b>
                  <span>{cost}M</span>
                </button>
              ))}
              {!nextUnlockCountries.length && (
                <span className="all-unlocked-message">모든 나라 해금 완료</span>
              )}
            </div>
          </div>
        </div>

        <div className="flight-passport-book">
          <div>
            <b>여권 스탬프 통계</b>
            <span>어느 나라 스탬프를 몇 개 모았는지 확인</span>
          </div>
          {getPassportStats().length ? (
            <>
              <div className="passport-stat-list">
                {getPassportStats().slice(0, 10).map((stat) => (
                  <span key={stat.code}>
                    <b>{stat.code}</b>
                    {stat.name}
                    <small>{stat.count}개</small>
                  </span>
                ))}
              </div>
              <div className="passport-stamp-list">
                {passportStamps.slice(0, 8).map((stamp) => (
                  <span key={stamp.id}>
                    {stamp.fromCode} → {stamp.toCode}
                    <small>{stamp.milesEarned}M</small>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p>아직 스탬프가 없습니다. 첫 비행을 완료해 보세요.</p>
          )}
        </div>

        <div className="flight-dashboard-grid">
          <div>
            <div className="flight-panel-head">
              <div>
                <b>WORLD ROUTE MAP</b>
                <span>{flightInProgress ? "비행 중 · 화면 위치는 고정" : `현재 선택: ${flightPickTarget === "from" ? "출발 국가" : "도착 국가"}`}</span>
              </div>
              <div className="flight-map-tools">
                <div className="flight-pick-tabs">
                  <button
                    type="button"
                    className={flightPickTarget === "from" ? "active" : ""}
                    onClick={() => setFlightPickTarget("from")}
                    disabled={studying || flightTicketCutting}
                  >
                    출발 선택
                  </button>
                  <button
                    type="button"
                    className={flightPickTarget === "to" ? "active" : ""}
                    onClick={() => setFlightPickTarget("to")}
                    disabled={studying || flightTicketCutting}
                  >
                    도착 선택
                  </button>
                </div>
                <div className="flight-zoom-controls">
                  <button type="button" onClick={(event) => changeFlightMapZoom((v) => v - 0.25, event)}>−</button>
                  <span>{Math.round(effectiveFlightMapZoom * 100)}%</span>
                  <button type="button" onClick={(event) => changeFlightMapZoom((v) => v + 0.25, event)}>+</button>
                </div>
              </div>
            </div>

            <div className="flight-map-viewport" ref={flightMapViewportRef}>
              <div
                className="flight-map"
                style={{
                  width: `${effectiveFlightMapZoom * 100}%`,
                  height: `${effectiveFlightMapZoom * 510}px`,
                  minWidth: "100%",
                  minHeight: 510,
                }}
              >
                <div className="flight-map-grid" />
                <svg viewBox="0 0 1672 941" preserveAspectRatio="none">
                  {route.segments.map((segment, index) => (
                    <polyline
                      key={`route-${index}`}
                      className="flight-route-line"
                      points={svgPolylinePoints(segment)}
                    />
                  ))}
                </svg>

                {visibleCountries.filter((country) => {
                  if (!flightInProgress) return true;
                  return country.code === from.code || country.code === to.code;
                }).map((country) => {
                  const markerPoint = getFlightMarkerPoint(country);
                  const left = `${(markerPoint.x / FLIGHT_MAP_WIDTH) * 100}%`;
                  const top = `${(markerPoint.y / FLIGHT_MAP_HEIGHT) * 100}%`;
                  const isFrom = country.code === from.code;
                  const isTo = country.code === to.code;
                  const selected = isFrom || isTo;
                  const locked = !isFlightCountryUnlocked(country.code);

                  return (
                    <button
                      key={country.code}
                      type="button"
                      title={locked ? `${country.name} 해금 필요 · ${flightUnlockCost(country)}M` : `${country.name} · ${country.city}`}
                      className={[
                        "flight-country",
                        selected ? "selected" : "",
                        locked ? "locked" : "",
                      ].filter(Boolean).join(" ")}
                      data-kind={isFrom ? `FROM · ${country.name}` : isTo ? `TO · ${country.name}` : locked ? `${flightUnlockCost(country)}M` : ""}
                      style={{ left, top }}
                      onClick={() => chooseCountryOnMap(country)}
                      disabled={studying || flightTicketCutting}
                    >
                      {locked ? "🔒" : country.code}
                    </button>
                  );
                })}

              <div
                  className="flight-plane"
                  style={{
                    left: `${(planePoint.x / FLIGHT_MAP_WIDTH) * 100}%`,
                    top: `${(planePoint.y / FLIGHT_MAP_HEIGHT) * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${planeRotate}deg)`,
                    color: stdrAirTierStyle.plane,
                  }}
                >
                  ✈
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    );
  };

  const renderEasyFlightControls = () => {
    if (!flightFeatureOpen) return null;

    const from = FLIGHT_COUNTRIES.find((c) => c.code === flightFromCode) || FLIGHT_COUNTRIES[0];
    const to = FLIGHT_COUNTRIES.find((c) => c.code === flightToCode) || FLIGHT_COUNTRIES[1];
    const minutes = activeFlight?.minutes || routeFlightMinutes(from, to);
    const distance = routeDistanceKm(from, to);
    const flightProgress = studying && activeFlight
      ? Math.min(100, Math.round((currentSessionSeconds / Math.max(1, minutes * 60)) * 100))
      : 0;

    return (
      <section className="easy-flight-controls">
        <div className="easy-flight-mileage-mini">
          <b>{flightMiles.toLocaleString()}M</b>
          <span>STDR Air {stdrAirTier.current.label} · 여권 {passportStamps.length}개 · 국가 {getPassportStats().length}개</span>
          <button type="button" onClick={() => setPassportOpen(true)}>여권</button>
        </div>
        <div
          className={[
            "flight-ticket",
            `stdr-tier-${selectedStdrThemeId}`,
            "easy-flight-boarding-pass",
            flightTicketUsed || (studying && activeFlight) ? "ticket-used" : "",
          ].filter(Boolean).join(" ")}
        >
          <div className="flight-ticket-main">
            <span>STDR AIR · {stdrAirTier.current.label}</span>
            <h2>{from.code} → {to.code}</h2>
            <p>{from.name} {from.city} 출발 · {to.name} {to.city} 도착</p>
            <div className="flight-ticket-row">
              <div>
                <small>DISTANCE</small>
                <b>{distance.toLocaleString()}km</b>
              </div>
              <div>
                <small>TIME</small>
                <b>{formatFlightTime(minutes)}</b>
              </div>
            </div>
          </div>
          <div className="flight-ticket-stub">
            <span>GATE</span>
            <b>SR</b>
            <small>{from.code}{to.code}</small>
          </div>
        </div>

        <div className="easy-flight-progress detailed">
          <div>
            <b>IN-FLIGHT STATUS</b>
            <span>{flightProgress}% 진행</span>
          </div>
          <div className="flight-progress">
            <i style={{ width: `${flightProgress}%` }} />
          </div>
          <div className="flight-stats easy-flight-stats">
            <div><span>오늘 총 공부</span><b>{formatTimer(todayTotalWithLive)}</b></div>
            <div><span>현재 세션</span><b>{formatTimer(currentSessionSeconds)}</b></div>
            <div><span>예상 비행시간</span><b>{formatFlightTime(minutes)}</b></div>
            <div><span>그룹 오늘 합계</span><b>{formatTimer(groupTodayTotal)}</b></div>
          </div>
        </div>

        <div className="easy-flight-actions">
          <div>
            <span>현재 선택된 공부</span>
            <b>{subject || "과목 없음"}</b>
            <small>{detail.trim() || "고급/쉬운 모드의 공부 과목과 내용을 기준으로 비행 공부가 시작됩니다."}</small>
          </div>

          {studying && activeFlight && (
            <div className="flight-live-edit">
              <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                {subjects.map((s) => <option key={s}>{s}</option>)}
              </select>
              <input
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="비행 중 공부 내용"
              />
              <button type="button" onClick={updateCurrentFlightStudyInfo}>
                과목/내용 변경
              </button>
            </div>
          )}

          {studying ? (
            <button type="button" className="flight-stop" onClick={stopStudy}>착륙하기 · 공부 종료</button>
          ) : (
            <button type="button" onClick={startFlightStudy} disabled={flightTicketCutting || from.code === to.code}>
              {flightTicketCutting ? "티켓 우측 절취 중..." : "탑승 시작"}
            </button>
          )}
        </div>
      </section>
    );
  };

  const RightPanelControlBar = ({ cardId }) => {
    const index = rightPanelOrder.indexOf(cardId);

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 900,
            color: "var(--text-sub)",
          }}
        >
          {RIGHT_PANEL_LABELS[cardId]}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            title="위로 이동"
            onClick={() => moveRightPanelCard(cardId, -1)}
            disabled={index <= 0}
            style={{
              ...S.lightButton,
              padding: "4px 7px",
              fontSize: 11,
              opacity: index <= 0 ? 0.35 : 1,
            }}
          >
            ↑
          </button>
          <button
            type="button"
            title="아래로 이동"
            onClick={() => moveRightPanelCard(cardId, 1)}
            disabled={index === -1 || index >= rightPanelOrder.length - 1}
            style={{
              ...S.lightButton,
              padding: "4px 7px",
              fontSize: 11,
              opacity: index === -1 || index >= rightPanelOrder.length - 1 ? 0.35 : 1,
            }}
          >
            ↓
          </button>
          <button
            type="button"
            title="숨기기"
            onClick={() => hideRightPanelCard(cardId)}
            style={{
              ...S.lightButton,
              padding: "4px 7px",
              fontSize: 11,
              color: "#dc2626",
              background: darkMode ? "rgba(127,29,29,0.28)" : "#fff1f2",
              borderColor: "#fecaca",
            }}
          >
            삭제
          </button>
        </div>
      </div>
    );
  };

  const RightPanelItem = ({ cardId, children }) => (
    <div>
      {!easyLayout && rightPanelEditOpen && <RightPanelControlBar cardId={cardId} />}
      {children}
    </div>
  );

  const renderChatNoticeSettingsCard = () => (
    <section style={{ ...S.card, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
        <div>
          <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>공부 중 채팅 알림</div>
          <h3 style={{ margin: "4px 0 0", fontSize: 18 }}>
            현재 {chatNotice ? "켜짐" : "꺼짐"}
          </h3>
        </div>
        <button
          style={{
            ...S.lightButton,
            background: chatNotice ? "var(--text-main)" : "var(--input-bg)",
            color: chatNotice ? "white" : "var(--text-main)",
          }}
          onClick={() => setChatNotice((v) => !v)}
        >
          {chatNotice ? "알림 끄기" : "알림 켜기"}
        </button>
      </div>
      <p style={{ ...S.small, margin: "8px 0 0", lineHeight: 1.4 }}>
        알림만 표시됩니다. 순공 중에는 설정을 켜도 꺼도 채팅 내용은 볼 수 없습니다.
      </p>
    </section>
  );

  const MobileHomeControlBar = ({ cardId }) => {
    const index = mobileHomeOrder.indexOf(cardId);

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          marginBottom: 6,
        }}
      >
        <span style={{ ...S.small, fontWeight: 900 }}>{MOBILE_HOME_LABELS[cardId]}</span>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            onClick={() => moveMobileHomeCard(cardId, -1)}
            disabled={index <= 0}
            style={{ ...S.lightButton, padding: "4px 7px", fontSize: 11, opacity: index <= 0 ? 0.35 : 1 }}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => moveMobileHomeCard(cardId, 1)}
            disabled={index === -1 || index >= mobileHomeOrder.length - 1}
            style={{ ...S.lightButton, padding: "4px 7px", fontSize: 11, opacity: index === -1 || index >= mobileHomeOrder.length - 1 ? 0.35 : 1 }}
          >
            ↓
          </button>
        </div>
      </div>
    );
  };

  const MobileHomeItem = ({ cardId, children }) => (
    <div
      style={{
        transition: "transform 360ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {mobileHomeEditOpen && <MobileHomeControlBar cardId={cardId} />}
      {children}
    </div>
  );

  const renderMobileHomeCard = (cardId) => {
    if (cardId === "stats") {
      const mobileStats = [
        ["오늘 총 공부", formatTimer(todayTotalWithLive), studying ? "진행 중 포함" : "저장된 기록 기준", "var(--accent)"],
        ["현재 과목", subject, formatTimer(currentSessionSeconds), "#00a661"],
        ["과목 오늘 누적", formatStudy(currentSubjectTodayTotal), subject, "#8b5cf6"],
        ["그룹 오늘 합계", formatTimer(groupTodayTotal), enteredGroupId ? "그룹원 전체 합계" : "입장한 방 없음", "#f97316"],
      ];

      return (
        <MobileHomeItem key={cardId} cardId={cardId}>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: easyLayout && isCompactScreen ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {mobileStats.map(([title, value, desc, color]) => (
              <div
                key={title}
                style={{
                  ...S.card,
                  padding: "11px 11px",
                  minHeight: 82,
                  border: "1px solid var(--border-soft)",
                }}
              >
                <div style={{ ...S.small, fontWeight: 900 }}>{title}</div>
                <div
                  style={{
                    fontSize: title === "현재 과목" ? 18 : 20,
                    fontWeight: 950,
                    letterSpacing: -1,
                    marginTop: 8,
                    color: "var(--text-main)",
                    lineHeight: 1.05,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {value}
                </div>
                <div style={{ ...S.small, marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: color, display: "inline-block" }} />
                  {desc}
                </div>
              </div>
            ))}
          </section>
        </MobileHomeItem>
      );
    }

    if (cardId === "study") {
      return (
        <MobileHomeItem key={cardId} cardId={cardId}>
          <section style={{ ...S.card, padding: 14, border: "1px solid var(--border-soft)" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: 12,
                flexDirection: "column",
              }}
            >
              <div>
                <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>실시간 순공 측정</div>
                <h2 style={{ margin: "2px 0 0", fontSize: 24, letterSpacing: -0.8 }}>
                  {studying ? `${subject} 공부 중` : "오늘 시작하기"}
                </h2>
              </div>
              <div style={{ textAlign: "left", width: "100%" }}>
                <div style={{ fontSize: 38, fontWeight: 950, letterSpacing: -1.4, lineHeight: 1 }}>
                  {formatTimer(currentSessionSeconds)}
                </div>
                <div style={{ ...S.small, marginTop: 4 }}>
                  {studying ? `${startedAt}부터 측정 중` : "대기 중"}
                </div>
              </div>
            </div>

            <div
              style={{
                background: "var(--app-bg)",
                border: "1px solid var(--border-soft)",
                borderRadius: 18,
                padding: 12,
              }}
            >
              <div style={S.grid2}>
                <Field label="과목 선택">
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      disabled={studying}
                      onClick={() => setSubjectPickerOpen((v) => !v)}
                      style={{
                        ...S.input,
                        width: "100%",
                        textAlign: "left",
                        cursor: studying ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <span>{subject}</span>
                      <span style={{ color: "var(--text-sub)", fontWeight: 900 }}>
                        {subjectPickerOpen ? "⌃" : "⌄"}
                      </span>
                    </button>

                    {subjectPickerOpen && !studying && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          top: "calc(100% + 6px)",
                          zIndex: 45,
                          display: "grid",
                          gap: 4,
                          maxHeight: 230,
                          overflowY: "auto",
                          padding: 6,
                          borderRadius: 16,
                          background: "var(--card-bg-solid)",
                          border: "1px solid var(--border-soft)",
                          boxShadow: "0 18px 42px rgba(25,31,40,0.16)",
                        }}
                      >
                        {subjects.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setSubject(s);
                              setSubjectPickerOpen(false);
                            }}
                            style={{
                              border: "none",
                              borderRadius: 12,
                              padding: "9px 10px",
                              textAlign: "left",
                              cursor: "pointer",
                              fontWeight: 850,
                              background: subject === s ? "var(--accent-soft)" : "transparent",
                              color: subject === s ? "var(--accent-text)" : "var(--text-main)",
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </Field>

                <Field label="과목 추가">
                  <div style={{ display: "flex", gap: 6 }}>
                    <input
                      style={S.input}
                      value={newSubject}
                      disabled={studying}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="예 : 미적분"
                    />
                    <button style={{ ...S.lightButton, minWidth: 40 }} onClick={addSubject}>
                      +
                    </button>
                  </div>
                </Field>
              </div>

              <Field label="자세한 공부 내용">
                <textarea
                  style={{ ...S.textarea, minHeight: 56 }}
                  value={detail}
                  disabled={studying}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="예 : 영어 단어 Day 12 암기 + 예문 복습"
                />
              </Field>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {studying ? (
                  <button style={{ ...S.button, minWidth: 110 }} onClick={stopStudy}>
                    공부 종료
                  </button>
                ) : (
                  <button
                    style={{ ...S.button, minWidth: 110 }}
                    disabled={!subject || !detail.trim()}
                    onClick={startStudy}
                  >
                    순공 시작
                  </button>
                )}
                <div style={{ ...S.small, lineHeight: 1.4 }}>
                  친구에게 표시: <b style={{ color: "var(--text-main)" }}>{subject}</b> · {detail}
                </div>
              </div>
            </div>
          </section>
        </MobileHomeItem>
      );
    }

    if (cardId === "sound") {
      return (
        <MobileHomeItem key={cardId} cardId={cardId}>
          <section style={{ ...S.card, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
              <div>
                <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>백색소음</div>
                <h3 style={{ margin: "4px 0 0", fontSize: 18 }}>
                  현재 {soundPlaying ? "재생 중" : "정지"}
                </h3>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {soundPlaying ? (
                  <button style={S.lightButton} onClick={stopSound}>
                    정지
                  </button>
                ) : (
                  <button style={S.button} onClick={playSound}>
                    재생
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 120px", gap: 8, marginTop: 10, alignItems: "center" }}>
              <select
                style={S.input}
                value={soundType}
                onChange={(e) => setSoundType(e.target.value)}
              >
                {SOUND_OPTIONS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>

              <div>
                <div style={{ ...S.small, fontSize: 10, marginBottom: 3 }}>소리 {soundVolume}%</div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <p style={{ ...S.small, margin: "7px 0 0", lineHeight: 1.35 }}>
              음원이 끝나면 자동으로 반복 재생됩니다.
            </p>
          </section>
        </MobileHomeItem>
      );
    }

    if (cardId === "weather") {
      return (
        <MobileHomeItem key={cardId} cardId={cardId}>
          <section style={{ ...S.card, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <div>
                <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>주간 날씨</div>
                <h3 style={{ margin: "4px 0 0", fontSize: 18 }}>오늘부터 7일 예보</h3>
              </div>
              <button
                type="button"
                style={{ ...S.lightButton, padding: "8px 10px", fontSize: 12 }}
                onClick={loadWeather}
                disabled={weatherLoading}
              >
                {weatherLoading ? "불러오는 중" : weatherDays.length ? "새로고침" : "불러오기"}
              </button>
            </div>

            <div
              style={{
                margin: "10px 0",
                padding: "10px 12px",
                borderRadius: 16,
                background: darkMode ? "rgba(30,41,59,0.92)" : "var(--accent-soft)",
                border: darkMode ? "1px solid rgba(96,165,250,0.30)" : "1px solid var(--accent-soft-2)",
                color: darkMode ? "var(--text-main)" : "var(--accent-text)",
                fontSize: 12,
                fontWeight: 800,
                lineHeight: 1.45,
              }}
            >
              {weatherMsg}
            </div>

            {weatherDays.length > 0 && (
              <div style={{ display: "grid", gap: 8 }}>
                {weatherDays.map((day) => {
                  const shouldCarryUmbrella =
                    Number(day.rain) >= 50 ||
                    (Number(day.rain) >= 30 && Number(day.rainAmount) >= 3);

                  return (
                    <div
                      key={day.date}
                      style={{
                        padding: "10px 11px",
                        borderRadius: 16,
                        background: shouldCarryUmbrella ? (darkMode ? "rgba(154,52,18,0.25)" : "#fff7ed") : "var(--soft-bg)",
                        border: shouldCarryUmbrella ? (darkMode ? "1px solid rgba(251,146,60,0.36)" : "1px solid #fed7aa") : "1px solid var(--border-soft)",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "52px 1fr auto",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <b style={{ color: shouldCarryUmbrella ? "#c2410c" : "var(--accent-text)", fontSize: 13 }}>
                          {day.label}
                        </b>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text-main)" }}>
                            {day.weather}
                          </div>
                          <div style={{ ...S.small, fontSize: 11 }}>
                            {day.date}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", fontWeight: 950, color: "var(--text-main)" }}>
                          {day.max}° / {day.min}°
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: 6,
                          marginTop: 8,
                          fontSize: 11,
                        }}
                      >
                        <div style={{ color: "var(--text-sub)" }}>강수 {day.rain}%</div>
                        <div style={{ color: "var(--text-sub)" }}>강수량 {Number(day.rainAmount).toFixed(1)}mm</div>
                        <div style={{ color: "var(--text-sub)" }}>바람 {day.wind}km/h</div>
                      </div>

                      {shouldCarryUmbrella && (
                        <div
                          style={{
                            marginTop: 7,
                            padding: "6px 8px",
                            borderRadius: 12,
                            background: darkMode ? "rgba(251,146,60,0.18)" : "rgba(251,146,60,0.14)",
                            color: darkMode ? "#fed7aa" : "#c2410c",
                            fontSize: 11,
                            fontWeight: 900,
                          }}
                        >
                          우산을 챙기는 것이 좋습니다.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </MobileHomeItem>
      );
    }

    if (cardId === "dday") {
      return (
        <MobileHomeItem key={cardId} cardId={cardId}>
          <section style={{ ...S.card, padding: 16 }}>
            <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>오늘 할 일</div>
            <h3 style={{ margin: "4px 0 10px", fontSize: 18 }}>선택한 D-DAY</h3>
            {selectedDday ? (
              <div style={{ background: "var(--app-bg)", borderRadius: 16, padding: 12 }}>
                <b>{selectedDday.title}</b>
                <div style={{ ...S.small, marginTop: 4 }}>
                  {formatDday(selectedDday.date)} · {selectedDday.category} · 중요도 {selectedDday.priority}
                </div>
              </div>
            ) : (
              <p style={S.small}>D-DAY를 설정해두면 여기에서 바로 확인할 수 있습니다.</p>
            )}
          </section>
        </MobileHomeItem>
      );
    }

    return null;
  };

  const renderMobileHomeSection = () => (
    <main
      key={`easy-home-${sectionTransitionKey}`}
      style={{
        minWidth: 0,
        display: easyLayout && mobileTab === "home" ? "grid" : "none",
        gap: 12,
        animation: "none",
      }}
    >
      

      {easyLayout && (
        <section className="mobile-flight-mode-toolbar">
          <button
            type="button"
            className="mobile-theme-button"
            onClick={cycleUnlockedStdrTheme}
            title={`STDR Air 등급 해금 테마 변경 · 현재 ${currentTheme.label}`}
          >
            테마 {currentTheme.label}
          </button>
          <button
            type="button"
            className="mobile-theme-button"
            onClick={toggleDarkMode}
            title="라이트/다크 모드 전환"
          >
            {darkMode ? "라이트 모드" : "다크 모드"}
          </button>
          <button
            type="button"
            className={flightFeatureOpen ? "mobile-flight-button active" : "mobile-flight-button"}
            onClick={toggleFlightFeature}
          >
            {flightFeatureOpen ? "비행 모드 ON" : "비행 모드 켜기"}
          </button>
        </section>
      )}

      <section style={{ ...S.card, padding: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <div>
            <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>
              홈 화면 {mobileHomeEditOpen ? "편집 중" : "편집"}
            </div>
            <div style={{ ...S.small, fontSize: 11, marginTop: 2 }}>
              {mobileHomeEditOpen
                ? "각 섹션 위의 ↑↓ 버튼으로 순서를 바꿀 수 있습니다."
                : "편집을 누르면 홈 섹션 순서를 바꿀 수 있습니다."}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {mobileHomeEditOpen && (
              <button
                type="button"
                style={{ ...S.lightButton, padding: "7px 9px", fontSize: 11 }}
                onClick={resetMobileHomeOrder}
              >
                초기화
              </button>
            )}
            <button
              type="button"
              style={{
                ...S.lightButton,
                padding: "7px 9px",
                fontSize: 11,
                background: mobileHomeEditOpen ? "var(--accent)" : "var(--input-bg)",
                color: mobileHomeEditOpen ? "white" : "var(--text-main)",
              }}
              onClick={() => setMobileHomeEditOpen((v) => !v)}
            >
              {mobileHomeEditOpen ? "완료" : "편집"}
            </button>
          </div>
        </div>
      </section>

      <div
        className={flightFeatureOpen ? "flight-feature-shell open mobile-flight-feature-shell" : "flight-feature-shell closed mobile-flight-feature-shell"}
        aria-hidden={!flightFeatureOpen}
      >
        {flightFeatureOpen && easyLayout && (
          <div className="mobile-flight-mode-head">
            <div>
              <b>STDR Air 비행기 모드</b>
              <span>핸드폰에서도 출발지/도착지 선택, 탑승권, 여권, IN-FLIGHT STATUS를 사용할 수 있어요.</span>
            </div>
            <button type="button" onClick={toggleFlightFeature}>닫기</button>
          </div>
        )}
        {renderFlightModeUi()}
        {renderEasyFlightControls()}
      </div>

      {mobileHomeOrder.map((cardId) => renderMobileHomeCard(cardId))}
    </main>
  );

  const renderEasyPlannerSection = () => (
    <main
      key={`easy-planner-${sectionTransitionKey}`}
      style={{
        minWidth: 0,
        display: easyLayout && mobileTab === "planner" ? "grid" : "none",
        gap: 12,
        animation: "none",
      }}
    >
      <section style={{ ...S.card, padding: easyLayout ? 12 : 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
            alignItems: "center",
            gap: 8,
          }}
        >
          <button style={S.lightButton} onClick={() => moveMonth(-1)}>
            이전
          </button>
          <b style={{ fontSize: easyLayout ? 14 : 16, textAlign: "center" }}>
            {calendarMonth.getFullYear()}년 {calendarMonth.getMonth() + 1}월
          </b>
          <button style={S.lightButton} onClick={() => moveMonth(1)}>
            다음
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: easyLayout ? 4 : 6,
            textAlign: "center",
            fontSize: 11,
            color: "#71717a",
            marginBottom: 6,
          }}
        >
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: easyLayout ? 4 : 6 }}>
          {getCalendarCells().map((date, idx) => {
            const amount = date && recordDateMap[date];
            const selected = date === plannerDate;

            return (
              <button
                key={idx}
                disabled={!date}
                onClick={() => date && setPlannerDate(date)}
                style={{
                  minHeight: easyLayout ? 46 : 60,
                  border: "1px solid var(--border)",
                  borderRadius: easyLayout ? 12 : 14,
                  background: selected ? "var(--text-main)" : "var(--card-bg-solid)",
                  color: selected ? "white" : "var(--text-main)",
                  opacity: date ? 1 : 0,
                  cursor: date ? "pointer" : "default",
                  padding: easyLayout ? 4 : 6,
                }}
              >
                {date && (
                  <>
                    <b>{Number(date.split("-")[2])}</b>
                    {amount && (
                      <div style={{ fontSize: easyLayout ? 9 : 10, marginTop: 2 }}>
                        {formatStudy(amount)}
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {renderPlanner(plannerRecords, plannerTotal, plannerDate)}
    </main>
  );

  const renderMobileChatSection = () => (
    <main
      key={`easy-chat-${sectionTransitionKey}`}
      style={{
        minWidth: 0,
        display: easyLayout && mobileTab === "chat" ? "grid" : "none",
        gap: 12,
        animation: "none",
      }}
    >
      <section style={{ ...S.card, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div>
            <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>채팅</div>
            <h2 style={{ margin: "4px 0 0", fontSize: 22 }}>
              {currentGroup?.name || "입장한 방 없음"}
            </h2>
          </div>
          {chatNotice && unread > 0 && (
            <div
              style={{
                minWidth: 24,
                height: 24,
                padding: "0 8px",
                borderRadius: 999,
                background: "#f59e0b",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 900,
              }}
            >
              {unread}
            </div>
          )}
        </div>

        {studying && (
          <div
            style={{
              background: "#fef3c7",
              color: "#92400e",
              padding: 12,
              borderRadius: 16,
              marginBottom: 12,
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            순공 측정 중에는 채팅 내용을 볼 수 없습니다.
            {chatNotice && unread > 0 && <div>새 메시지 {unread}개 도착</div>}
          </div>
        )}

        {!enteredGroupId && (
          <div
            style={{
              background: "var(--soft-bg)",
              border: "1px solid var(--border-soft)",
              borderRadius: 16,
              padding: 12,
              marginBottom: 12,
              ...S.small,
            }}
          >
            채팅을 사용하려면 먼저 그룹에 입장해 주세요.
          </div>
        )}

        <div
          style={{
            height: "55vh",
            minHeight: 320,
            overflowY: "auto",
            border: "1px solid var(--border)",
            borderRadius: 18,
            padding: 12,
            background: "var(--soft-bg)",
          }}
        >
          {!studying &&
            messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  justifyContent: m.senderUid === uid ? "flex-end" : "flex-start",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    maxWidth: "78%",
                    background: m.senderUid === uid ? "var(--text-main)" : "var(--input-bg)",
                    color: m.senderUid === uid ? "white" : "var(--text-main)",
                    padding: 12,
                    borderRadius: 18,
                    fontSize: 14,
                    lineHeight: 1.35,
                  }}
                >
                  <div style={{ fontSize: 11, opacity: 0.7 }}>{m.senderName}</div>
                  {m.text}
                </div>
              </div>
            ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            style={S.input}
            value={chatText}
            disabled={studying || !enteredGroupId}
            onChange={(e) => setChatText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter" || e.nativeEvent?.isComposing) return;
              e.preventDefault();
              sendMessage();
            }}
            placeholder={studying ? "순공 중에는 채팅할 수 없습니다" : "메시지를 입력해 주세요"}
          />
          <button style={S.button} disabled={studying || !enteredGroupId || chatSendingRef.current} onClick={sendMessage}>
            전송
          </button>
        </div>
      </section>
    </main>
  );

  const renderRightPanelCard = (cardId) => {
    if (hiddenRightCards.includes(cardId)) return null;

    if (cardId === "theme") {
      return null;
    }

    if (cardId === "total") {
      return (
        <RightPanelItem key={cardId} cardId={cardId}>
          <section
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
              color: "white",
              borderRadius: 28,
              padding: "20px 18px",
              boxShadow: "0 18px 42px var(--accent-shadow)",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.78, fontWeight: 900 }}>오늘 총 공부시간</div>
            <div style={{ fontSize: "clamp(44px, 5vw, 68px)", fontWeight: 950, lineHeight: 0.98, letterSpacing: -2, marginTop: 6 }}>
              {formatTimer(todayTotalWithLive)}
            </div>
            <div style={{ fontSize: 12, opacity: 0.78, marginTop: 8 }}>
              {studying ? "현재 진행 중인 순공시간 포함" : "오늘 저장된 기록 기준"}
            </div>
          </section>
        </RightPanelItem>
      );
    }

    if (cardId === "flightTicket") {
      if (!flightFeatureOpen) return null;

      const from = FLIGHT_COUNTRIES.find((c) => c.code === flightFromCode) || FLIGHT_COUNTRIES[0];
      const to = FLIGHT_COUNTRIES.find((c) => c.code === flightToCode) || FLIGHT_COUNTRIES[1];
      const distance = routeDistanceKm(from, to);
      const minutes = routeFlightMinutes(from, to);

      return (
        <RightPanelItem key={cardId} cardId={cardId}>
          <section className="flight-side-card">
            <div className="flight-panel-head">
              <div>
                <b>BOARDING PASS</b>
                <span>{flightTicketCutting ? "티켓 확인 중" : studying ? "비행 중" : "탑승 대기"}</span>
              </div>
            </div>

            <div
              className={[
                "flight-ticket",
                `stdr-tier-${selectedStdrThemeId}`,
                flightTicketUsed || (studying && activeFlight) ? "ticket-used" : "",
              ].filter(Boolean).join(" ")}
            >
              <div className="flight-ticket-main">
                <span>STDR AIR · {stdrAirTier.current.label}</span>
                <h2>{from.code} → {to.code}</h2>
                <p>{from.name} {from.city} 출발 · {to.name} {to.city} 도착</p>
                <div className="flight-ticket-row">
                  <div>
                    <small>DISTANCE</small>
                    <b>{distance.toLocaleString()}km</b>
                  </div>
                  <div>
                    <small>TIME</small>
                    <b>{formatFlightTime(minutes)}</b>
                  </div>
                </div>
              </div>
              <div className="flight-ticket-stub">
                <span>GATE</span>
                <b>SR</b>
                <small>{from.code}{to.code}</small>
              </div>
            </div>

            <div className="flight-study-form flight-action-only">
              <div className="flight-current-study">
                <span>현재 선택된 공부</span>
                <b>{subject || "과목 없음"}</b>
                <small>{detail.trim() || "고급모드의 공부 과목과 내용을 기준으로 비행 공부가 시작됩니다."}</small>
              </div>

              {studying && activeFlight && (
                <div className="flight-live-edit">
                  <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                    {subjects.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <input
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    placeholder="비행 중 공부 내용"
                  />
                  <button type="button" onClick={updateCurrentFlightStudyInfo}>
                    과목/내용 변경
                  </button>
                </div>
              )}

              {studying ? (
                <button type="button" className="flight-stop" onClick={stopStudy}>착륙하기 · 공부 종료</button>
              ) : (
                <button type="button" onClick={startFlightStudy} disabled={flightTicketCutting || from.code === to.code}>
                  {flightTicketCutting ? "티켓 우측 절취 중..." : "탑승 시작"}
                </button>
              )}
            </div>
          </section>
        </RightPanelItem>
      );
    }

    if (cardId === "flightStatus") {
      if (!flightFeatureOpen) return null;

      const from = FLIGHT_COUNTRIES.find((c) => c.code === flightFromCode) || FLIGHT_COUNTRIES[0];
      const to = FLIGHT_COUNTRIES.find((c) => c.code === flightToCode) || FLIGHT_COUNTRIES[1];
      const minutes = activeFlight?.minutes || routeFlightMinutes(from, to);
      const liveElapsedSeconds =
        studying && activeFlight?.startedAtMs
          ? Math.max(0, Math.floor((effectiveFlightNowTick - activeFlight.startedAtMs) / 1000))
          : currentSessionSeconds;
      const flightProgress = studying && activeFlight
        ? Math.min(100, Math.round((liveElapsedSeconds / Math.max(1, minutes * 60)) * 100))
        : 0;

      return (
        <RightPanelItem key={cardId} cardId={cardId}>
          <section className="flight-side-card">
            <div className="flight-panel-head">
              <div>
                <b>IN-FLIGHT STATUS</b>
                <span>{flightProgress}% 진행</span>
              </div>
            </div>

            <div className="flight-progress">
              <i style={{ width: `${flightProgress}%` }} />
            </div>

            <div className="flight-stats">
              <div><span>오늘 총 공부</span><b>{formatTimer(todayTotalWithLive)}</b></div>
              <div><span>현재 세션</span><b>{formatTimer(currentSessionSeconds)}</b></div>
              <div><span>예상 비행시간</span><b>{formatFlightTime(minutes)}</b></div>
              <div><span>그룹 합계</span><b>{formatTimer(groupTodayTotal)}</b></div>
            </div>
          </section>
        </RightPanelItem>
      );
    }

    if (cardId === "weather") {
      if (isCompactScreen) return null;

      return (
        <RightPanelItem key={cardId} cardId={cardId}>
          <section style={{ ...S.card, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <div>
                <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>주간 날씨</div>
                <h3 style={{ margin: "4px 0 0", fontSize: 18 }}>오늘부터 7일 예보</h3>
              </div>
              <button
                type="button"
                style={{ ...S.lightButton, padding: "8px 10px", fontSize: 12 }}
                onClick={loadWeather}
                disabled={weatherLoading}
              >
                {weatherLoading ? "불러오는 중" : weatherDays.length ? "새로고침" : "불러오기"}
              </button>
            </div>

            <div
              style={{
                margin: "10px 0",
                padding: "10px 12px",
                borderRadius: 16,
                background: darkMode ? "rgba(30,41,59,0.92)" : "var(--accent-soft)",
                border: darkMode ? "1px solid rgba(96,165,250,0.30)" : "1px solid var(--accent-soft-2)",
                color: darkMode ? "var(--text-main)" : "var(--accent-text)",
                fontSize: 12,
                fontWeight: 800,
                lineHeight: 1.45,
              }}
            >
              {weatherMsg}
            </div>

            {weatherDays.length > 0 && (
              <div style={{ display: "grid", gap: 8 }}>
                {weatherDays.map((day) => {
                  const shouldCarryUmbrella =
                    Number(day.rain) >= 50 ||
                    (Number(day.rain) >= 30 && Number(day.rainAmount) >= 3);

                  return (
                    <div
                      key={day.date}
                      style={{
                        padding: "10px 11px",
                        borderRadius: 16,
                        background: shouldCarryUmbrella ? (darkMode ? "rgba(154,52,18,0.25)" : "#fff7ed") : "var(--soft-bg)",
                        border: shouldCarryUmbrella ? (darkMode ? "1px solid rgba(251,146,60,0.36)" : "1px solid #fed7aa") : "1px solid var(--border-soft)",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "52px 1fr auto",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <b style={{ color: shouldCarryUmbrella ? "#c2410c" : "var(--accent-text)", fontSize: 13 }}>
                          {day.label}
                        </b>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text-main)" }}>
                            {day.weather}
                          </div>
                          <div style={{ ...S.small, fontSize: 11 }}>
                            {day.date}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", fontWeight: 950, color: "var(--text-main)" }}>
                          {day.max}° / {day.min}°
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: 6,
                          marginTop: 8,
                          fontSize: 11,
                        }}
                      >
                        <div style={{ color: "var(--text-sub)" }}>강수 {day.rain}%</div>
                        <div style={{ color: "var(--text-sub)" }}>강수량 {Number(day.rainAmount).toFixed(1)}mm</div>
                        <div style={{ color: "var(--text-sub)" }}>바람 {day.wind}km/h</div>
                      </div>

                      {shouldCarryUmbrella && (
                        <div
                          style={{
                            marginTop: 7,
                            padding: "6px 8px",
                            borderRadius: 12,
                            background: darkMode ? "rgba(251,146,60,0.18)" : "rgba(251,146,60,0.14)",
                            color: darkMode ? "#fed7aa" : "#c2410c",
                            fontSize: 11,
                            fontWeight: 900,
                          }}
                        >
                          우산을 챙기는 것이 좋습니다.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </RightPanelItem>
      );
    }

    if (cardId === "dday") {
      if (isCompactScreen) return null;

      return (
        <RightPanelItem key={cardId} cardId={cardId}>
          <section style={{ ...S.card, padding: 16 }}>
            <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>오늘 할 일</div>
            <h3 style={{ margin: "4px 0 10px", fontSize: 18 }}>선택한 D-DAY</h3>
            {selectedDday ? (
              <div style={{ background: "var(--app-bg)", borderRadius: 16, padding: 12 }}>
                <b>{selectedDday.title}</b>
                <div style={{ ...S.small, marginTop: 4 }}>
                  {formatDday(selectedDday.date)} · {selectedDday.category} · 중요도 {selectedDday.priority}
                </div>
              </div>
            ) : (
              <p style={S.small}>D-DAY를 설정해두면 여기에서 바로 확인할 수 있습니다.</p>
            )}
          </section>
        </RightPanelItem>
      );
    }

    if (cardId === "rank") {
      if (easyLayout) return null;

      return (
        <RightPanelItem key={cardId} cardId={cardId}>
          {renderGroupRankCard()}
        </RightPanelItem>
      );
    }

    return null;
  };

  const displayOrderMinutes = (time) => {
    const minutes = parseTimeMinutes(time);
    return minutes < 360 ? minutes + 1440 : minutes;
  };

  const visualTimeColor = (record, index) => {
    if (record.kind === "meal") {
      return darkMode
        ? { bg: "rgba(148,163,184,0.24)", border: "rgba(148,163,184,0.34)", text: "#e5e7eb" }
        : { bg: "rgba(229,229,224,0.84)", border: "rgba(212,212,204,0.85)", text: "#3f3f46" };
    }

    const colorId = record.timeColorId || getTaskColorId(record, index);
    const preset =
      TIMETABLE_COLOR_PRESETS.find((item) => item.id === colorId) ||
      TIMETABLE_COLOR_PRESETS[0];

    return darkMode ? preset.dark : preset.light;
  };

  const renderVisualTimeTable = (items, compact = false) => {
    const rowHeight = compact ? 28 : 38;
    const labelWidth = compact ? 54 : 68;
    const baseMinutes = 6 * 60;
    const totalMinutes = 24 * 60;
    const sortedItems = [...items].sort((a, b) => displayOrderMinutes(a.start) - displayOrderMinutes(b.start));

    const normalizedItems = sortedItems
      .map((item, index) => {
        const rawStart = displayOrderMinutes(item.start);
        let rawEnd = displayOrderMinutes(item.end || item.start);

        // 핵심 수정:
        // 시작/종료 시간이 같은 기록을 "다음날까지 24시간 공부"로 착각하지 않게 처리합니다.
        // 종료 시간이 시작보다 작을 때만 자정을 넘긴 기록으로 봅니다.
        if (rawEnd < rawStart) {
          rawEnd += 24 * 60;
        }

        if (rawEnd === rawStart) {
          const durationFromSeconds = Math.max(0, Math.round(Number(item.seconds || 0) / 60));
          rawEnd = rawStart + durationFromSeconds;
        }

        const start = Math.max(baseMinutes, Math.min(baseMinutes + totalMinutes, rawStart));
        const end = Math.max(baseMinutes, Math.min(baseMinutes + totalMinutes, rawEnd));

        return { item, index, start, end };
      })
      .filter((entry) => entry.end > entry.start);

    return (
      <div className="visual-timetable-wrap cell-timetable-wrap">
        <div
          className="cell-timetable"
          style={{
            "--tt-row-height": `${rowHeight}px`,
            "--tt-label-width": `${labelWidth}px`,
          }}
        >
          {timeTableHours.map((hour, rowIndex) => {
            const rowStart = baseMinutes + rowIndex * 60;

            return (
              <div key={hour} className="cell-timetable-row" style={{ minHeight: rowHeight }}>
                <div className="cell-timetable-hour" style={{ width: labelWidth }}>
                  {hour}
                </div>

                {Array.from({ length: 6 }, (_, cellIndex) => {
                  const cellStart = rowStart + cellIndex * 10;
                  const cellEnd = cellStart + 10;

                  const fills = normalizedItems
                    .map((entry) => {
                      const overlapStart = Math.max(entry.start, cellStart);
                      const overlapEnd = Math.min(entry.end, cellEnd);
                      if (overlapEnd <= overlapStart) return null;

                      const color = visualTimeColor(entry.item, entry.index);
                      const left = ((overlapStart - cellStart) / 10) * 100;
                      const width = ((overlapEnd - overlapStart) / 10) * 100;

                      return {
                        id: `${entry.item.id || entry.index}-${rowIndex}-${cellIndex}-${overlapStart}-${overlapEnd}`,
                        left,
                        width,
                        color,
                        title: `${entry.item.start}-${entry.item.end}`,
                      };
                    })
                    .filter(Boolean);

                  return (
                    <div key={`${hour}-${cellIndex}`} className="cell-timetable-cell">
                      {fills.map((fill, fillIndex) => (
                        <i
                          key={fill.id}
                          className="cell-timetable-fill"
                          title={fill.title}
                          style={{
                            left: `${fill.left}%`,
                            width: `${fill.width}%`,
                            top: fills.length > 1 ? `${4 + fillIndex * 5}px` : undefined,
                            height: fills.length > 1 ? "10px" : undefined,
                            background: fill.color.bg,
                            borderColor: fill.color.border,
                          }}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTodayPlannerCompact = (list, total, date) => {
    const sortedList = sortStudyRecordsByTime(list);
    const mergedTaskList = mergeCloseTaskRecords(sortedList);
    const mealBlocksForDate = mealBlocks
      .filter((meal) => meal.date === date)
      .sort((a, b) => studyOrderMinutes(a.start) - studyOrderMinutes(b.start));
    const timeTableItems = [
      ...mergedTaskList.map((record) => ({ ...record, kind: "study" })),
      ...mealBlocksForDate.map((meal) => ({
        ...meal,
        kind: "meal",
        subject: meal.type,
        detail: "순공시간에 포함되지 않는 식사 시간",
        seconds: Math.max(0, (studyOrderMinutes(meal.end) - studyOrderMinutes(meal.start)) * 60),
      })),
    ].sort((a, b) => studyOrderMinutes(a.start) - studyOrderMinutes(b.start));

    return (
      <div
        style={{
          ...S.card,
          padding: 10,
          marginTop: 0,
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <div
          className="planner-hero"
          style={{
            background: darkMode
              ? "linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.96) 100%)"
              : "linear-gradient(135deg, var(--accent-soft) 0%, var(--accent-soft-2) 45%, var(--accent-soft-3) 100%)",
            color: darkMode ? "#e5e7eb" : "var(--accent-text)",
            padding: "8px 10px",
            borderRadius: 12,
            marginBottom: 8,
            flex: "0 0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            border: "1px solid var(--accent-soft-2)",
          }}
        >
          <div>
            <div style={{ fontSize: 9, letterSpacing: 1.2, opacity: 0.85 }}>
              PERSONAL STUDY PLANNER
            </div>
            <h3 style={{ margin: "2px 0 0", fontSize: 16 }}>{date} 플래너</h3>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, opacity: 0.85 }}>오늘 순공</div>
            <b style={{ fontSize: 18 }}>{formatStudy(total)}</b>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: easyLayout ? "1fr" : "minmax(0, 1.15fr) minmax(190px, 0.85fr)",
            gap: 10,
            flex: 1,
            minHeight: 0,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <SectionTitle>DATE</SectionTitle>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{date}</div>
              </div>
              <div>
                <SectionTitle>D-DAY</SectionTitle>
                <select
                  style={{ ...S.input, padding: "6px 8px", fontSize: 11 }}
                  value={plannerDdayId}
                  onChange={(e) => setPlannerDdayId(e.target.value)}
                >
                  <option value="">D-DAY 없음</option>
                  {ddays.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} · {formatDday(d.date)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {plannerDday && (
              <div
                style={{
                  background: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: 6,
                  marginTop: 6,
                  fontSize: 11,
                }}
              >
                <b>{plannerDday.title}</b> {formatDday(plannerDday.date)} · {plannerDday.category}
              </div>
            )}

            <SectionTitle>CONTENTS</SectionTitle>
            <div
              style={{
                background: "var(--input-bg)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: 7,
                minHeight: 54,
                flex: "0 0 auto",
                overflowY: "auto",
              }}
            >
              {mergedTaskList.length ? (
                groupedPlannerContents(mergedTaskList).map((group) => (
                  <div key={group.subject} style={{ fontSize: 11, marginBottom: 6 }}>
                    <b>{group.subject}</b>
                    <div style={{ color: "var(--text-mid)", marginTop: 2 }}>
                      {group.details.map((detailText) => (
                        <div key={detailText}>· {detailText}</div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <span style={{ ...S.small, fontSize: 11 }}>아직 오늘 기록된 공부가 없습니다.</span>
              )}
            </div>

            <SectionTitle>TASK</SectionTitle>
            <div
              style={{
                borderTop: "1px solid var(--border)",
                flex: 1,
                minHeight: 118,
                overflowY: "auto",
              }}
            >
              {mergedTaskList.length ? (
                mergedTaskList.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "74px 1fr 58px",
                      gap: 6,
                      padding: "5px 0",
                      borderBottom: "1px solid var(--border)",
                      fontSize: 11,
                    }}
                  >
                    <div style={{ color: "#71717a", fontSize: 10 }}>
                      {r.start} - {r.end}
                      {r.mergedIds?.length > 1 && (
                        <>
                          <br />
                          <span style={{ color: "var(--accent)", fontWeight: 900 }}>
                            {r.mergedIds.length}개 병합
                          </span>
                        </>
                      )}
                    </div>
                    <div>
                      <b>{r.subject}</b> <span style={{ color: "#71717a" }}>{r.detail}</span>
                      {renderTaskColorPicker(r, true)}
                    </div>
                    <b style={{ textAlign: "right" }}>{formatStudy(r.seconds || 0)}</b>
                  </div>
                ))
              ) : (
                <div style={{ padding: 8, ...S.small, fontSize: 11 }}>기록 없음</div>
              )}
            </div>

            <SectionTitle>MEMO</SectionTitle>
            <textarea
              style={{ ...S.textarea, minHeight: 64, padding: "7px 8px", fontSize: 11 }}
              value={memos[date] || ""}
              onChange={(e) => saveMemo(date, e.target.value)}
              placeholder="오늘 메모. 이 메모는 다른 사람에게 공유되지 않습니다."
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <SectionTitle>TIME TABLE</SectionTitle>
            <div style={{ ...S.small, fontSize: 10 }}>06:00부터 다음날 05:00까지</div>
            {renderVisualTimeTable(timeTableItems, true)}
          </div>
        </div>
      </div>
    );
  };

  const renderPlanner = (list, total, date) => {
    const sortedList = sortStudyRecordsByTime(list);
    const mergedTaskList = mergeCloseTaskRecords(sortedList);
    const mealBlocksForDate = mealBlocks
      .filter((meal) => meal.date === date)
      .sort((a, b) => studyOrderMinutes(a.start) - studyOrderMinutes(b.start));
    const timeTableItems = [
      ...mergedTaskList.map((record) => ({ ...record, kind: "study" })),
      ...mealBlocksForDate.map((meal) => ({
        ...meal,
        kind: "meal",
        subject: meal.type,
        detail: "순공시간에 포함되지 않는 식사 시간",
        seconds: Math.max(0, (studyOrderMinutes(meal.end) - studyOrderMinutes(meal.start)) * 60),
      })),
    ].sort((a, b) => studyOrderMinutes(a.start) - studyOrderMinutes(b.start));

    return (
      <div style={S.card}>
        <div
          className="planner-hero"
          style={{
            background: darkMode
              ? "linear-gradient(135deg, rgba(30,41,59,0.96) 0%, rgba(15,23,42,0.98) 100%)"
              : "linear-gradient(135deg, var(--accent-soft) 0%, var(--accent-soft-2) 45%, var(--accent-soft-3) 100%)",
            color: darkMode ? "#e5e7eb" : "var(--accent-text)",
            padding: 16,
            borderRadius: 18,
            marginBottom: 18,
            border: darkMode ? "1px solid rgba(96,165,250,0.30)" : "1px solid var(--accent-soft-2)",
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: 2, opacity: 0.8 }}>
            PERSONAL STUDY PLANNER
          </div>
          <h2 style={{ margin: "6px 0 0" }}>{date} 공부 플래너</h2>
          <div style={{ fontSize: 13, marginTop: 5, opacity: 0.9 }}>
            공부 기록은 참여 방에 공유 · MEMO는 비공개
          </div>
        </div>

        <div style={S.grid2}>
          <div>
            <SectionTitle>DATE</SectionTitle>
            <h3>{date}</h3>

            <SectionTitle>D-DAY</SectionTitle>
            <select
              style={S.input}
              value={plannerDdayId}
              onChange={(e) => setPlannerDdayId(e.target.value)}
            >
              <option value="">D-DAY 없음</option>
              {ddays.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} · {formatDday(d.date)}
                </option>
              ))}
            </select>

            {plannerDday && (
              <div style={{ ...S.small, marginTop: 8 }}>
                <b>{plannerDday.title}</b> {formatDday(plannerDday.date)}
                <br />
                {plannerDday.category} · 중요도 {plannerDday.priority}
                {plannerDday.memo && (
                  <>
                    <br />
                    {plannerDday.memo}
                  </>
                )}
              </div>
            )}

            <SectionTitle>CONTENTS</SectionTitle>
            <div
              style={{
                background: "var(--input-bg)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 12,
                minHeight: 60,
              }}
            >
              {mergedTaskList.length ? (
                groupedPlannerContents(mergedTaskList).map((group) => (
                  <div key={group.subject} style={{ fontSize: 14, marginBottom: 10 }}>
                    <b>{group.subject}</b>
                    <div style={{ color: "var(--text-mid)", marginTop: 3 }}>
                      {group.details.map((detailText) => (
                        <div key={detailText}>· {detailText}</div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <span style={S.small}>기록된 공부 내용이 없습니다.</span>
              )}
            </div>

            <SectionTitle>TASK</SectionTitle>
            <div style={{ borderTop: "1px solid var(--border)" }}>
              {mergedTaskList.length ? (
                mergedTaskList.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "90px 1fr 80px",
                      gap: 8,
                      padding: "10px 0",
                      borderBottom: "1px solid var(--border)",
                      fontSize: 13,
                    }}
                  >
                    <div style={S.small}>
                      {r.start} - {r.end}
                      {r.mergedIds?.length > 1 && (
                        <>
                          <br />
                          <span style={{ color: "var(--accent)", fontWeight: 900 }}>
                            {r.mergedIds.length}개 병합
                          </span>
                        </>
                      )}
                    </div>
                    <div>
                      <b>{r.subject}</b>
                      <br />
                      {editingRecordId === r.id ? (
                        <div style={{ display: "grid", gap: 6, marginTop: 6 }}>
                          <input
                            style={S.input}
                            value={editingRecordDetail}
                            onChange={(e) => setEditingRecordDetail(e.target.value)}
                            placeholder="수정할 공부 내용"
                          />
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              type="button"
                              style={{ ...S.lightButton, padding: "6px 8px", fontSize: 11 }}
                              onClick={() => saveRecordDetailOnly(r.id)}
                            >
                              저장
                            </button>
                            <button
                              type="button"
                              style={{ ...S.lightButton, padding: "6px 8px", fontSize: 11 }}
                              onClick={() => {
                                setEditingRecordId("");
                                setEditingRecordDetail("");
                              }}
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span style={S.small}>{r.detail}</span>
                          {renderTaskColorPicker(r)}
                        </>
                      )}
                    </div>
                    <div style={{ display: "grid", justifyItems: "end", gap: 6 }}>
                      <b style={{ textAlign: "right" }}>{formatStudy(r.seconds || 0)}</b>
                      <button
                        type="button"
                        style={{ ...S.lightButton, padding: "5px 8px", fontSize: 11 }}
                        onClick={() => {
                          setEditingRecordId(r.id);
                          setEditingRecordDetail(r.detail || "");
                        }}
                      >
                        내용 수정
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: 12, ...S.small }}>기록 없음</div>
              )}
            </div>

            <SectionTitle>MEMO</SectionTitle>
            <textarea
              style={{ ...S.textarea, minHeight: 120 }}
              value={memos[date] || ""}
              onChange={(e) => saveMemo(date, e.target.value)}
              placeholder="오늘 느낀 점, 내일 할 일, 오답 메모 등을 적어줘. 이 메모는 다른 사람에게 공유되지 않습니다."
            />
            <div style={S.small}>MEMO는 본인만 볼 수 있는 비공개 메모입니다.</div>
          </div>

          <div>
            <SectionTitle>TOTAL</SectionTitle>
            <h1>{formatStudy(total)}</h1>

            <SectionTitle>식사 시간</SectionTitle>
            <div style={S.small}>점심/저녁식사는 순공시간에 포함되지 않는 시간으로 Time Table에만 표시됩니다.</div>
            <div className="meal-block-form">
              <select
                value={mealForm.type}
                onChange={(e) => setMealForm((prev) => ({ ...prev, type: e.target.value }))}
              >
                <option>점심식사</option>
                <option>저녁식사</option>
                <option>식사</option>
              </select>
              <input
                type="time"
                value={mealForm.start}
                onChange={(e) => setMealForm((prev) => ({ ...prev, start: e.target.value }))}
              />
              <input
                type="time"
                value={mealForm.end}
                onChange={(e) => setMealForm((prev) => ({ ...prev, end: e.target.value }))}
              />
              <button type="button" onClick={addMealBlock}>추가</button>
            </div>

            {mealBlocksForDate.length > 0 && (
              <div className="meal-block-list">
                {mealBlocksForDate.map((meal) => (
                  <span key={meal.id}>
                    {meal.type} {meal.start}-{meal.end}
                    <button type="button" onClick={() => removeMealBlock(meal.id)}>×</button>
                  </span>
                ))}
              </div>
            )}

            <SectionTitle>TIME TABLE</SectionTitle>
            <div style={S.small}>06:00부터 다음날 05:00까지 하루 흐름으로 표시됩니다.</div>

            {renderVisualTimeTable(timeTableItems, false)}
          </div>
        </div>
      </div>
    );
  };

  const renderFlightFullscreenSummary = () => {
    const from = FLIGHT_COUNTRIES.find((c) => c.code === (activeFlight?.fromCode || flightFromCode)) || FLIGHT_COUNTRIES[0];
    const to = FLIGHT_COUNTRIES.find((c) => c.code === (activeFlight?.toCode || flightToCode)) || FLIGHT_COUNTRIES[1];
    const minutes = activeFlight?.minutes || routeFlightMinutes(from, to);
    const distance = routeDistanceKm(from, to);
    const liveElapsedSeconds =
      studying && activeFlight?.startedAtMs
        ? Math.max(0, Math.floor((effectiveFlightNowTick - activeFlight.startedAtMs) / 1000))
        : currentSessionSeconds;
    const flightProgress = studying && activeFlight
      ? Math.min(100, Math.round((liveElapsedSeconds / Math.max(1, minutes * 60)) * 100))
      : 0;

    return (
      <aside className="flight-fullscreen-side">
        <section className={["flight-ticket", flightTicketUsed || (studying && activeFlight) ? "ticket-used" : ""].filter(Boolean).join(" ")}>
          <div className="flight-ticket-main">
            <span>BOARDING PASS</span>
            <h2>{from.code} → {to.code}</h2>
            <p>{from.name} {from.city} 출발 · {to.name} {to.city} 도착</p>
            <div className="flight-ticket-row">
              <div>
                <small>DISTANCE</small>
                <b>{distance.toLocaleString()}km</b>
              </div>
              <div>
                <small>TIME</small>
                <b>{formatFlightTime(minutes)}</b>
              </div>
            </div>
          </div>
          <div className="flight-ticket-stub">
            <span>GATE</span>
            <b>SR</b>
            <small>{from.code}{to.code}</small>
          </div>
        </section>

        <section className="flight-side-card">
          <div className="flight-side-head">
            <b>IN-FLIGHT STATUS</b>
            <span>{flightProgress}% 진행</span>
          </div>
          <div className="flight-progress">
            <i style={{ width: `${flightProgress}%` }} />
          </div>
          <div className="flight-stats">
            <div><span>오늘 총 공부</span><b>{formatTimer(todayTotalWithLive)}</b></div>
            <div><span>현재 세션</span><b>{formatTimer(currentSessionSeconds)}</b></div>
            <div><span>예상 비행시간</span><b>{formatFlightTime(minutes)}</b></div>
            <div><span>그룹 오늘 합계</span><b>{formatTimer(groupTodayTotal)}</b></div>
          </div>
        </section>
      </aside>
    );
  };

  if (loadingAuth) {
    return <div style={{ ...S.page, ...themeVars }}>앱을 불러오는 중입니다...</div>;
  }

  if (!user) {
    return (
      <div style={{ ...S.page, ...themeVars }}>
        <div style={{ maxWidth: 900, margin: "40px auto" }}>
          <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
            <div style={S.grid2}>
              <div style={{ background: "#191f28", color: "white", padding: 34 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 18,
                      background: "rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <StudyRoomLogo dark={true} size={38} />
                  </div>
                  <p style={{ color: "#a1a1aa", margin: 0, fontWeight: 900 }}>Study Room</p>
                </div>
                <h1 style={{ fontSize: 40, lineHeight: 1.1 }}>
                  친구와 공부하기 전, 먼저 로그인해 주세요.
                </h1>
                <p style={{ color: "#d4d4d8" }}>
                  귀하의 데이터는 안전하게 보관됩니다.
                </p>
                <div
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    padding: 16,
                    borderRadius: 18,
                    marginTop: 28,
                    fontSize: 14,
                  }}
                >
                  <b>회원가입 규칙</b>
                  <p>· 아이디: 영어와 숫자만, 최대 12글자</p>
                  <p>· 비밀번호: 영어, 숫자, *, -만, 최대 20글자</p>
                  <p>· Firebase 기준에 따라 비밀번호는 최소 6글자</p>
                </div>
              </div>

              <div style={{ padding: 34 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  <button
                    style={authMode === "login" ? S.button : S.lightButton}
                    onClick={() => setAuthMode("login")}
                  >
                    로그인
                  </button>
                  <button
                    style={authMode === "signup" ? S.button : S.lightButton}
                    onClick={() => setAuthMode("signup")}
                  >
                    회원가입
                  </button>
                </div>

                {authMode === "login" ? (
                  <>
                    <h2>로그인</h2>
                    <Field label="아이디">
                      <input
                        style={S.input}
                        value={login.id}
                        onChange={(e) =>
                          setLogin((p) => ({ ...p, id: normalizeId(e.target.value) }))
                        }
                      />
                    </Field>
                    <Field label="비밀번호">
                      <input
                        style={S.input}
                        type="password"
                        value={login.pw}
                        onChange={(e) =>
                          setLogin((p) => ({ ...p, pw: normalizePw(e.target.value) }))
                        }
                      />
                    </Field>
                    <button style={{ ...S.button, width: "100%" }} onClick={doLogin}>
                      로그인
                    </button>
                  </>
                ) : (
                  <>
                    <h2>회원가입</h2>
                    <Field label="아이디">
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          style={S.input}
                          value={signup.id}
                          onChange={(e) => {
                            setSignup((p) => ({ ...p, id: normalizeId(e.target.value) }));
                            setIdCheck({ id: "", ok: false, msg: "" });
                          }}
                        />
                        <button style={S.lightButton} onClick={checkId}>
                          중복확인
                        </button>
                      </div>
                      <div
                        style={{
                          ...S.small,
                          marginTop: 6,
                          color: idCheck.ok ? "#15803d" : "#71717a",
                        }}
                      >
                        {idCheck.msg || "영어와 숫자만 가능, 최대 12글자"}
                      </div>
                    </Field>

                    <Field label="비밀번호">
                      <input
                        style={S.input}
                        type="password"
                        value={signup.pw}
                        onChange={(e) =>
                          setSignup((p) => ({ ...p, pw: normalizePw(e.target.value) }))
                        }
                      />
                    </Field>

                    <Field label="비밀번호 다시 입력">
                      <input
                        style={S.input}
                        type="password"
                        value={signup.pw2}
                        onChange={(e) =>
                          setSignup((p) => ({ ...p, pw2: normalizePw(e.target.value) }))
                        }
                      />
                    </Field>

                    {signup.pw2 && (
                      <p style={{ color: signup.pw === signup.pw2 ? "#15803d" : "#dc2626" }}>
                        {signup.pw === signup.pw2
                          ? "비밀번호가 일치합니다."
                          : "비밀번호가 일치하지 않습니다."}
                      </p>
                    )}

                    <button style={{ ...S.button, width: "100%" }} onClick={doSignup}>
                      회원가입 후 입장
                    </button>
                  </>
                )}

                {authMsg && (
                  <div
                    style={{
                      marginTop: 14,
                      background: darkMode ? "rgba(127,29,29,0.35)" : "#fef2f2",
                      color: "#dc2626",
                      padding: 12,
                      borderRadius: 14,
                    }}
                  >
                    {authMsg}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={darkMode ? "dark-app" : ""}
      data-theme-mode={darkMode ? "dark" : "light"}
      style={{
        ...S.page,
        ...themeVars,
        background: "var(--app-bg)",
      }}
    >
      <audio ref={soundRef} preload="auto" playsInline controls={false} style={{ display: "none" }} />
      <audio ref={soundRefB} preload="auto" playsInline controls={false} style={{ display: "none" }} />
      <style>
        {`
          @keyframes srFadeSlideIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          @keyframes srOverlayFade {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes srOverlayFadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }

          @keyframes srModalPop {
            0% {
              opacity: 0;
              filter: blur(3px);
            }
            100% {
              opacity: 1;
              filter: blur(0);
            }
          }

          @keyframes srModalPopOut {
            0% {
              opacity: 1;
              filter: blur(0);
            }
            100% {
              opacity: 0;
              filter: blur(5px);
            }
          }

          button,
          select,
          input,
          textarea {
            transition:
              background-color 280ms cubic-bezier(0.16, 1, 0.3, 1),
              color 280ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 280ms cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 320ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 280ms cubic-bezier(0.16, 1, 0.3, 1);
          }

          button:active {
            transform: none;
          }


          .flight-os {
            min-height: calc(100vh - 28px);
            color: #0f172a;
            padding: 18px;
            background:
              radial-gradient(circle at 18% 0%, rgba(14,165,233,0.18), transparent 30%),
              radial-gradient(circle at 92% 18%, rgba(37,99,235,0.12), transparent 32%),
              linear-gradient(135deg, #dbeafe 0%, #eff6ff 42%, #ffffff 100%);
            border: 1px solid rgba(147,197,253,0.8);
          }

          .flight-os * {
            box-sizing: border-box;
          }

          .flight-topbar {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 18px;
            align-items: center;
            background: rgba(255,255,255,0.88);
            border: 1px solid rgba(147,197,253,0.75);
            border-radius: 28px;
            padding: 16px 18px;
            box-shadow: 0 18px 42px rgba(37,99,235,0.10);
            margin-bottom: 14px;
            backdrop-filter: blur(18px);
          }

          .flight-title {
            font-size: 30px;
            font-weight: 950;
            letter-spacing: -1.1px;
            color: #0f172a;
          }

          .flight-subtitle {
            margin-top: 4px;
            color: #64748b;
            font-size: 13px;
            font-weight: 850;
          }

          .flight-route-summary {
            text-align: center;
            display: grid;
            grid-template-columns: auto auto auto;
            gap: 10px;
            align-items: center;
            color: #0f172a;
            font-weight: 950;
          }

          .flight-route-summary span {
            min-width: 54px;
            padding: 8px 10px;
            border-radius: 16px;
            background: #eff6ff;
            color: var(--flight-blue);
            border: 1px solid #bfdbfe;
          }

          .flight-route-summary small {
            grid-column: 1 / -1;
            color: #64748b;
            font-size: 12px;
          }

          .flight-mode-tabs {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
          }

          .flight-mode-tabs button,
          .flight-os button {
            border: none;
            border-radius: 16px;
            padding: 10px 12px;
            background: #eff6ff;
            color: #1e3a8a;
            font-weight: 950;
            cursor: pointer;
            border: 1px solid #bfdbfe;
          }

          .flight-mode-tabs button.active,
          .flight-os button:hover {
            background: linear-gradient(135deg, #2563eb, #0ea5e9);
            color: white;
            box-shadow: 0 12px 26px rgba(37,99,235,0.20);
          }

          .flight-grid {
            display: grid;
            grid-template-columns: minmax(0, 1.35fr) minmax(360px, 0.8fr);
            grid-template-areas:
              "map ticket"
              "map status"
              "side side";
            gap: 14px;
          }

          .flight-panel {
            background: rgba(255,255,255,0.92);
            border: 1px solid rgba(147,197,253,0.78);
            border-radius: 30px;
            padding: 16px;
            box-shadow: 0 18px 42px rgba(37,99,235,0.10);
            backdrop-filter: blur(18px);
          }

          .flight-panel-head {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            align-items: center;
            margin-bottom: 12px;
          }

          .flight-panel-head b {
            color: #0f172a;
            font-size: 13px;
            letter-spacing: 0.8px;
          }

          .flight-panel-head span {
            color: var(--flight-blue);
            font-weight: 950;
            font-size: 12px;
          }

          .flight-map-panel { grid-area: map; min-height: 640px; }
          .flight-ticket-panel { grid-area: ticket; }
          .flight-status-panel { grid-area: status; }
          .flight-side-panel { grid-area: side; }

          .flight-map {
            position: relative;
            height: 510px;
            border-radius: 28px;
            overflow: hidden;
            background:
              linear-gradient(rgba(37,99,235,0.06), rgba(37,99,235,0.06)),
              url("/images/blue-world-map.png");
            background-size: cover;
            background-position: center;
            border: 1px solid #bfdbfe;
          }

          .flight-map-grid {
            position: absolute;
            inset: 0;
            background: linear-gradient(rgba(255,255,255,0.08), rgba(37,99,235,0.04));
            pointer-events: none;
          }

          .flight-map svg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
          }

          .flight-route-line {
            fill: none;
            stroke: #2563eb;
            stroke-width: 5;
            stroke-linecap: round;
            stroke-dasharray: 14 12;
            filter: drop-shadow(0 8px 10px rgba(37,99,235,0.24));
          }

          .flight-country {
            position: absolute;
            transform: translate(-50%, -50%);
            min-width: 38px;
            height: 30px;
            padding: 0 8px;
            border-radius: 999px !important;
            font-size: 11px;
            background: rgba(255,255,255,0.88) !important;
            color: #0f172a !important;
            border: 1px solid #bfdbfe !important;
          }

          .flight-country.selected {
            background: #2563eb !important;
            color: white !important;
            box-shadow: 0 10px 24px rgba(37,99,235,0.28);
          }

          .flight-plane {
            position: absolute;
            top: 42%;
            transform: translate(-50%, -50%);
            font-size: 34px;
            transition: left 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            filter: drop-shadow(0 12px 16px rgba(37,99,235,0.25));
          }

          .flight-selectors {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 12px;
          }

          .flight-selectors label,
          .flight-study-form label {
            display: grid;
            gap: 6px;
          }

          .flight-selectors span,
          .flight-study-form span,
          .flight-sound-box span,
          .flight-member-list > b {
            color: #475569;
            font-size: 12px;
            font-weight: 950;
          }

          .flight-os input,
          .flight-os select,
          .flight-os textarea {
            width: 100%;
            border: 1px solid #bfdbfe;
            border-radius: 16px;
            background: #f8fbff;
            color: #0f172a;
            padding: 11px 12px;
            font-weight: 800;
          }

          .flight-os textarea {
            min-height: 86px;
          }

          .flight-ticket {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 92px;
            min-height: 210px;
            border-radius: 26px;
            overflow: hidden;
            background: linear-gradient(135deg, #ffffff, #eff6ff);
            border: 1px solid #bfdbfe;
            box-shadow: 0 18px 34px rgba(37,99,235,0.12);
            transform-origin: left center;
          }

          .flight-ticket.cutting .flight-ticket-stub {
            animation: ticketCutAway 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes ticketCutAway {
            0% {
              transform: translateX(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateX(110px) rotate(9deg);
              opacity: 0;
            }
          }

          .flight-ticket-main {
            padding: 20px;
          }

          .flight-ticket-main > span {
            color: var(--flight-blue);
            font-size: 12px;
            font-weight: 950;
            letter-spacing: 1.2px;
          }

          .flight-ticket-main h2 {
            margin: 8px 0 4px;
            font-size: 40px;
            letter-spacing: -1.5px;
            color: #0f172a;
          }

          .flight-ticket-main p {
            margin: 0;
            color: #64748b;
            font-weight: 800;
          }

          .flight-ticket-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-top: 18px;
          }

          .flight-ticket-row div {
            background: #f8fbff;
            border: 1px solid #dbeafe;
            border-radius: 18px;
            padding: 10px;
          }

          .flight-ticket-row small,
          .flight-ticket-stub span,
          .flight-ticket-stub small {
            display: block;
            color: #64748b;
            font-size: 10px;
            font-weight: 900;
          }

          .flight-ticket-row b,
          .flight-ticket-stub b {
            color: #0f172a;
          }

          .flight-ticket-stub {
            display: grid;
            place-items: center;
            text-align: center;
            background: #dbeafe;
            border-left: 2px dashed #93c5fd;
            padding: 14px 8px;
          }

          .flight-ticket-stub b {
            font-size: 32px;
            color: var(--flight-blue);
          }

          .flight-study-form {
            display: grid;
            gap: 10px;
            margin-top: 12px;
          }

          .flight-study-form button,
          .flight-stop {
            min-height: 46px;
          }

          .flight-stop {
            background: #fee2e2 !important;
            color: #b91c1c !important;
            border-color: #fecaca !important;
          }

          .flight-progress {
            height: 12px;
            border-radius: 999px;
            background: #dbeafe;
            overflow: hidden;
            margin-bottom: 12px;
          }

          .flight-progress i {
            display: block;
            height: 100%;
            background: linear-gradient(90deg, #2563eb, #0ea5e9);
            border-radius: 999px;
            transition: width 0.5s ease;
          }

          .flight-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .flight-stats div,
          .flight-sound-box,
          .flight-member-list div {
            border: 1px solid #dbeafe;
            background: #f8fbff;
            border-radius: 20px;
            padding: 11px;
          }

          .flight-stats span,
          .flight-member-list small {
            display: block;
            color: #64748b;
            font-size: 11px;
            font-weight: 900;
          }

          .flight-stats b {
            color: #0f172a;
          }

          .flight-quick-buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
          }

          .flight-sound-box {
            display: grid;
            gap: 8px;
            margin-top: 12px;
          }

          .flight-member-list {
            display: grid;
            gap: 8px;
            margin-top: 12px;
          }

          .flight-member-list div {
            display: grid;
            grid-template-columns: 24px 1fr 10px auto;
            gap: 8px;
            align-items: center;
          }

          .flight-member-list i {
            width: 8px;
            height: 8px;
            border-radius: 999px;
            background: #cbd5e1;
          }

          .flight-member-list i.online {
            background: var(--flight-green);
            box-shadow: 0 0 0 4px rgba(34,197,94,0.14);
          }

          .flight-member-list p {
            color: #64748b;
            margin: 0;
          }

          @media (max-width: 1280px) {
            .flight-grid {
              grid-template-columns: 1fr;
              grid-template-areas:
                "ticket"
                "map"
                "status"
                "side";
            }

            .flight-topbar {
              grid-template-columns: 1fr;
              text-align: center;
            }

            .flight-mode-tabs {
              justify-content: center;
            }

            .flight-quick-buttons,
            .flight-selectors,
            .flight-stats {
              grid-template-columns: 1fr 1fr;
            }
          }

          .flight-dashboard-card {
            display: grid;
            gap: 12px;
            margin-bottom: 12px;
            border-radius: 30px;
            padding: 16px;
            color: #0f172a;
            background:
              radial-gradient(circle at 14% 0%, rgba(14,165,233,0.16), transparent 30%),
              linear-gradient(135deg, rgba(255,255,255,0.98), rgba(239,246,255,0.94));
            border: 1px solid rgba(147,197,253,0.78);
            box-shadow: 0 18px 42px rgba(37,99,235,0.10);
          }

          .flight-dashboard-head {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            align-items: center;
          }

          .flight-kicker {
            color: var(--flight-blue);
            font-size: 11px;
            font-weight: 950;
            letter-spacing: 1.4px;
          }

          .flight-dashboard-head h2 {
            margin: 4px 0;
            font-size: 28px;
            letter-spacing: -1px;
          }

          .flight-dashboard-head p {
            margin: 0;
            color: #64748b;
            font-weight: 750;
          }

          .flight-dashboard-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 340px;
            gap: 12px;
            align-items: start;
          }

          .flight-control-stack {
            display: grid;
            gap: 12px;
          }

          .flight-ticket-panel-inner,
          .flight-status-panel-inner {
            background: rgba(255,255,255,0.78);
            border: 1px solid rgba(191,219,254,0.9);
            border-radius: 26px;
            padding: 12px;
          }

          .flight-map {
            height: min(54vh, 520px);
            min-height: 420px;
          }

          .flight-map-land {
            position: absolute;
            background: rgba(37,99,235,0.08);
            border: 1px solid rgba(37,99,235,0.08);
            filter: blur(0.2px);
          }

          .flight-map-land.land-a {
            left: 12%;
            top: 24%;
            width: 22%;
            height: 26%;
            border-radius: 54% 46% 48% 52%;
            transform: rotate(-12deg);
          }

          .flight-map-land.land-b {
            left: 43%;
            top: 22%;
            width: 21%;
            height: 28%;
            border-radius: 44% 56% 52% 48%;
            transform: rotate(8deg);
          }

          .flight-map-land.land-c {
            left: 62%;
            top: 36%;
            width: 18%;
            height: 22%;
            border-radius: 56% 44% 54% 46%;
            transform: rotate(-8deg);
          }

          .flight-map-land.land-d {
            left: 74%;
            top: 66%;
            width: 12%;
            height: 12%;
            border-radius: 56% 44% 54% 46%;
            transform: rotate(15deg);
          }

          .flight-pick-tabs {
            display: flex;
            gap: 6px;
            padding: 4px;
            border-radius: 999px;
            overflow: hidden;
            background: rgba(239,246,255,0.9);
            border: 1px solid rgba(191,219,254,0.95);
          }

          .flight-pick-tabs button {
            padding: 8px 10px;
            border-radius: 999px !important;
          }

          .flight-pick-tabs button.active {
            background: linear-gradient(135deg, #2563eb, #0ea5e9);
            color: white;
          }

          .flight-country::after {
            content: attr(data-kind);
            position: absolute;
            left: 50%;
            top: -18px;
            transform: translateX(-50%);
            color: #2563eb;
            font-size: 9px;
            font-weight: 950;
            white-space: nowrap;
          }

          .flight-country[data-kind=""]::after {
            display: none;
          }

          .flight-plane {
            color: #0f172a;
            z-index: 7;
          }

          .flight-route-line {
            stroke-dasharray: 12 10;
            animation: flightRouteDash 1.8s linear infinite;
          }

          @keyframes flightRouteDash {
            to {
              stroke-dashoffset: -44;
            }
          }

          .flight-ticket-row {
            grid-template-columns: repeat(2, 1fr);
          }

          @media (max-width: 1280px) {
            .flight-dashboard-grid {
              grid-template-columns: 1fr;
            }

            .flight-dashboard-head {
              display: grid;
            }

            .flight-route-summary {
              justify-content: start;
            }
          }

          .flight-toggle-card {
            display: flex;
            justify-content: space-between;
            gap: 14px;
            align-items: center;
            margin-bottom: 12px;
            border-radius: 28px;
            padding: 16px 18px;
            background:
              radial-gradient(circle at 12% 0%, rgba(14,165,233,0.14), transparent 28%),
              linear-gradient(135deg, rgba(255,255,255,0.98), rgba(239,246,255,0.94));
            border: 1px solid rgba(191,219,254,0.95);
            box-shadow: 0 14px 34px rgba(37,99,235,0.08);
          }

          .flight-toggle-card h3 {
            margin: 3px 0 3px;
            font-size: 18px;
            letter-spacing: -0.45px;
            color: #0f172a;
          }

          .flight-toggle-card p {
            margin: 0;
            color: #64748b;
            font-size: 13px;
            font-weight: 750;
            line-height: 1.45;
          }

          .flight-toggle-card button,
          .flight-dashboard-card button,
          .flight-ticket-panel-inner button,
          .flight-status-panel-inner button {
            border-radius: 16px !important;
            border: 1px solid rgba(191,219,254,0.95) !important;
            background: #eff6ff !important;
            color: #1e40af !important;
            font-weight: 950 !important;
            box-shadow: none !important;
            transition:
              transform 180ms ease,
              box-shadow 180ms ease,
              background 180ms ease,
              color 180ms ease;
          }

          .flight-toggle-card button:hover,
          .flight-dashboard-card button:hover,
          .flight-ticket-panel-inner button:hover {
            transform: translateY(-1px);
            background: linear-gradient(135deg, #2563eb, #0ea5e9) !important;
            color: white !important;
            box-shadow: 0 12px 26px rgba(37,99,235,0.18) !important;
          }

          .flight-dashboard-card button:disabled,
          .flight-ticket-panel-inner button:disabled {
            opacity: 0.52;
            cursor: not-allowed;
            transform: none;
            box-shadow: none !important;
          }

          .flight-add-subject {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 42px;
            gap: 8px;
          }

          .flight-add-subject button {
            min-height: 42px;
            padding: 0 !important;
            font-size: 20px;
            line-height: 1;
          }

          .flight-study-form {
            gap: 10px;
          }

          .flight-study-form button {
            border-radius: 18px !important;
          }

          .flight-stop {
            background: #fee2e2 !important;
            color: #b91c1c !important;
            border-color: #fecaca !important;
          }

          .flight-stop:hover {
            background: linear-gradient(135deg, #ef4444, #dc2626) !important;
            color: white !important;
          }

          @media (max-width: 900px) {
            .flight-toggle-card {
              display: grid;
            }
          }

          .flight-dashboard-card .flight-map {
            background:
              linear-gradient(rgba(255,255,255,0.03), rgba(37,99,235,0.06)),
              url("/images/blue-world-map.png") !important;
            background-size: cover !important;
            background-position: center !important;
          }

          .flight-dashboard-card .flight-map-grid {
            background:
              linear-gradient(rgba(255,255,255,0.05), rgba(37,99,235,0.03)) !important;
            pointer-events: none;
          }

          .flight-dashboard-card .flight-country {
            min-width: 30px;
            height: 24px;
            padding: 0 6px;
            font-size: 10px;
            background: rgba(255,255,255,0.88) !important;
            border: 1px solid rgba(37,99,235,0.30) !important;
            box-shadow: 0 6px 14px rgba(15,23,42,0.10);
          }

          .flight-dashboard-card .flight-country.selected {
            background: #2563eb !important;
            color: white !important;
            border-color: rgba(255,255,255,0.76) !important;
            box-shadow: 0 10px 24px rgba(37,99,235,0.28);
          }

          .flight-dashboard-card .flight-route-line {
            stroke: #ffffff;
            stroke-width: 6;
            stroke-linecap: round;
            stroke-dasharray: 16 12;
            filter:
              drop-shadow(0 0 5px rgba(37,99,235,0.95))
              drop-shadow(0 10px 10px rgba(15,23,42,0.20));
          }

          .flight-dashboard-card .flight-plane {
            font-size: 34px;
            color: #0f172a;
            text-shadow:
              0 2px 0 rgba(255,255,255,0.8),
              0 10px 22px rgba(37,99,235,0.35);
          }

          /* Expanded flight map: easier country selection */
          .flight-dashboard-card {
            min-height: calc(100vh - 170px);
            padding: 18px;
          }

          .flight-dashboard-card .flight-dashboard-grid {
            grid-template-columns: minmax(0, 1fr) 380px;
            align-items: stretch;
          }

          .flight-dashboard-card .flight-map {
            height: clamp(620px, calc(100vh - 310px), 780px) !important;
            min-height: 620px !important;
          }

          .flight-dashboard-card .flight-country {
            min-width: 40px !important;
            height: 34px !important;
            padding: 0 9px !important;
            font-size: 11px !important;
            border-radius: 999px !important;
            z-index: 5;
          }

          .flight-dashboard-card .flight-country::before {
            content: "";
            position: absolute;
            inset: -8px;
            border-radius: 999px;
          }

          .flight-dashboard-card .flight-country:hover {
            transform: translate(-50%, -50%) scale(1.12);
            background: #dbeafe !important;
            border-color: #2563eb !important;
            box-shadow: 0 12px 28px rgba(37,99,235,0.26);
          }

          .flight-dashboard-card .flight-country.selected {
            transform: translate(-50%, -50%) scale(1.08);
          }

          .flight-dashboard-card .flight-plane {
            font-size: 42px !important;
          }

          .flight-ticket {
            min-height: 230px;
          }

          .flight-ticket-main h2 {
            font-size: 44px;
          }

          @media (max-width: 1280px) {
            .flight-dashboard-card .flight-dashboard-grid {
              grid-template-columns: 1fr;
            }

            .flight-dashboard-card .flight-map {
              height: 580px !important;
              min-height: 540px !important;
            }
          }

          .flight-map-tools {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: flex-end;
          }

          .flight-zoom-controls {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 4px;
            border-radius: 999px;
            overflow: hidden;
            background: rgba(239,246,255,0.9);
            border: 1px solid rgba(191,219,254,0.95);
          }

          .flight-zoom-controls button {
            width: 32px;
            height: 30px;
            padding: 0 !important;
            border-radius: 999px !important;
          }

          .flight-zoom-controls span {
            min-width: 48px;
            text-align: center;
            color: #1e40af;
            font-size: 12px;
            font-weight: 950;
          }

          .flight-map-viewport {
            position: relative;
            height: clamp(620px, calc(100vh - 310px), 780px);
            min-height: 620px;
            overflow: auto;
            border-radius: 28px;
            border: 1px solid #bfdbfe;
            background: #dbeafe;
            scroll-behavior: smooth;
          }

          .flight-map-viewport .flight-map {
            height: auto !important;
            min-height: 0 !important;
            aspect-ratio: 1672 / 941;
            min-width: 100%;
            transition: width 220ms ease;
            transform-origin: 0 0;
            border: 0;
            border-radius: 0;
          }

          .flight-dashboard-card .flight-map {
            height: auto !important;
            min-height: 0 !important;
          }

          .flight-dashboard-card .flight-route-line {
            fill: none;
            stroke: #ffffff;
            stroke-width: 6;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 16 12;
            animation: flightRouteDash 1.8s linear infinite;
            filter:
              drop-shadow(0 0 5px rgba(37,99,235,0.95))
              drop-shadow(0 10px 10px rgba(15,23,42,0.20));
          }

          @media (max-width: 1280px) {
            .flight-map-viewport {
              height: 580px;
              min-height: 540px;
            }
          }

          .flight-map-viewport {
            overscroll-behavior: contain;
          }

          .flight-map-viewport .flight-map {
            transform-origin: center center;
          }

          .flight-dashboard-card.tracking-flight .flight-pick-tabs {
            display: none;
          }

          .flight-dashboard-card.tracking-flight .flight-zoom-controls {
            opacity: 0.72;
          }

          .flight-dashboard-card.tracking-flight .flight-map-viewport {
            scroll-behavior: smooth;
          }

          .flight-dashboard-card.tracking-flight .flight-route-line {
            stroke-width: 7;
            stroke-dasharray: 18 10;
          }

          .flight-dashboard-card.tracking-flight .flight-plane {
            font-size: 52px !important;
            z-index: 20;
            filter:
              drop-shadow(0 0 8px rgba(255,255,255,0.95))
              drop-shadow(0 12px 22px rgba(37,99,235,0.42));
          }

          .flight-dashboard-card.tracking-flight .flight-map-grid {
            background:
              radial-gradient(circle at center, rgba(255,255,255,0.08), rgba(37,99,235,0.05)) !important;
          }

          .flight-map-viewport {
            scroll-behavior: auto;
          }

          .flight-dashboard-card.tracking-flight .flight-country.selected {
            display: grid;
            min-width: 54px !important;
            height: 38px !important;
            font-size: 12px !important;
            z-index: 24;
            opacity: 0.96;
          }

          .flight-dashboard-card.tracking-flight .flight-country.selected::after {
            top: -22px;
            color: #0f172a;
            background: rgba(255,255,255,0.88);
            border: 1px solid rgba(147,197,253,0.8);
            border-radius: 999px;
            padding: 2px 7px;
            box-shadow: 0 8px 18px rgba(15,23,42,0.12);
          }

          .flight-dashboard-card.tracking-flight .flight-plane {
            font-size: 60px !important;
          }

          /* Keep zoom anchored to the viewport center instead of visually expanding from one edge. */
          .flight-map-viewport {
            scroll-behavior: auto !important;
          }

          .flight-map-viewport .flight-map {
            transition: none !important;
            transform-origin: 0 0 !important;
          }

          /* Keep the existing movable right-side sections visible in advanced mode. */
          .flight-dashboard-card {
            min-height: auto;
          }

          .flight-dashboard-card .flight-dashboard-grid {
            grid-template-columns: minmax(0, 1fr) 340px;
          }

          @media (max-width: 1280px) {
            .flight-dashboard-card .flight-dashboard-grid {
              grid-template-columns: 1fr;
            }
          }

          /* Flight section layout: map first, ticket directly below it */
          .flight-dashboard-card .flight-dashboard-grid {
            grid-template-columns: 1fr !important;
            align-items: stretch;
          }

          .flight-control-stack {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(280px, 0.65fr);
            gap: 12px;
            align-items: start;
          }

          .flight-ticket-panel-inner {
            order: 1;
          }

          .flight-status-panel-inner {
            order: 2;
          }

          .flight-action-only {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: center;
            gap: 12px;
          }

          .flight-current-study {
            display: grid;
            gap: 3px;
            padding: 12px 14px;
            border-radius: 18px;
            background: #f8fbff;
            border: 1px solid #dbeafe;
            min-width: 0;
          }

          .flight-current-study span {
            color: #64748b;
            font-size: 11px;
            font-weight: 900;
          }

          .flight-current-study b {
            color: #0f172a;
            font-size: 15px;
            font-weight: 950;
          }

          .flight-current-study small {
            color: #64748b;
            font-size: 12px;
            line-height: 1.35;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .flight-action-only > button {
            min-width: 160px;
            min-height: 48px;
            margin: 0 !important;
          }

          @media (max-width: 980px) {
            .flight-control-stack {
              grid-template-columns: 1fr;
            }

            .flight-action-only {
              grid-template-columns: 1fr;
            }

            .flight-action-only > button {
              width: 100%;
            }
          }

          /* Flight map stays in the main area; ticket/status live as movable right-panel cards. */
          .flight-dashboard-card .flight-dashboard-grid {
            grid-template-columns: 1fr !important;
          }

          .flight-side-card {
            background:
              radial-gradient(circle at 12% 0%, rgba(14,165,233,0.14), transparent 30%),
              linear-gradient(135deg, rgba(255,255,255,0.98), rgba(239,246,255,0.94));
            border: 1px solid rgba(191,219,254,0.95);
            border-radius: 28px;
            padding: 14px;
            box-shadow: 0 14px 34px rgba(37,99,235,0.08);
          }

          .flight-side-card .flight-ticket {
            grid-template-columns: minmax(0, 1fr) 78px;
            min-height: 188px;
          }

          .flight-side-card .flight-ticket-main {
            padding: 16px;
          }

          .flight-side-card .flight-ticket-main h2 {
            font-size: 32px;
          }

          .flight-side-card .flight-ticket-row {
            grid-template-columns: 1fr;
            margin-top: 12px;
          }

          .flight-side-card .flight-ticket-stub b {
            font-size: 26px;
          }

          .flight-side-card .flight-action-only {
            grid-template-columns: 1fr;
          }

          .flight-side-card .flight-action-only > button {
            width: 100%;
          }

          .flight-side-card .flight-current-study small {
            white-space: normal;
          }

          .flight-side-card .flight-stats {
            grid-template-columns: 1fr;
          }

          .flight-dashboard-card .flight-country {
            transform: translate(-50%, -50%);
          }

          .flight-dashboard-card .flight-country:hover,
          .flight-dashboard-card .flight-country.selected {
            z-index: 30;
          }

          /* Boarding pass tear state: persists after takeoff */
          .flight-ticket {
            position: relative;
          }

          .flight-ticket.cutting {
            animation: ticketMainTear 0.78s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .flight-ticket.cutting .flight-ticket-stub {
            animation: ticketCutAway 0.78s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
          }

          .flight-ticket.ticket-used {
            grid-template-columns: minmax(0, 1fr) 0px !important;
          }

          .flight-ticket.ticket-used .flight-ticket-stub {
            opacity: 0 !important;
            transform: translateX(120px) rotate(10deg) !important;
            pointer-events: none;
          }

          .flight-ticket.ticket-used .flight-ticket-main {
            position: relative;
            border-right: 2px dashed rgba(37,99,235,0.28);
            clip-path: polygon(
              0 0,
              calc(100% - 12px) 0,
              100% 8%,
              calc(100% - 10px) 16%,
              100% 24%,
              calc(100% - 12px) 32%,
              100% 40%,
              calc(100% - 10px) 48%,
              100% 56%,
              calc(100% - 12px) 64%,
              100% 72%,
              calc(100% - 10px) 80%,
              100% 88%,
              calc(100% - 12px) 100%,
              0 100%
            );
          }

          .flight-ticket.ticket-used .flight-ticket-main::after {
            content: "BOARDING COMPLETE";
            position: absolute;
            right: 12px;
            bottom: 12px;
            border: 1px solid rgba(37,99,235,0.28);
            border-radius: 999px;
            padding: 4px 8px;
            color: #2563eb;
            background: rgba(239,246,255,0.88);
            font-size: 10px;
            font-weight: 950;
            letter-spacing: 0.5px;
          }

          @keyframes ticketMainTear {
            0% {
              transform: translateX(0);
              filter: none;
            }
            45% {
              transform: translateX(-2px);
              filter: drop-shadow(0 10px 18px rgba(37,99,235,0.20));
            }
            100% {
              transform: translateX(0);
              filter: none;
            }
          }

          /* Keep the landing/end button visually stable while the timer re-renders every second */
          .flight-stop,
          .flight-stop:hover,
          .flight-side-card .flight-stop,
          .flight-side-card .flight-stop:hover {
            animation: none !important;
            transition: none !important;
            transform: none !important;
            box-shadow: none !important;
            background: #fee2e2 !important;
            color: #b91c1c !important;
            border-color: #fecaca !important;
          }

          /* One-time boarding pass tear: starts once when ticket-used is added, then remains cut */
          .flight-ticket {
            transition: grid-template-columns 780ms cubic-bezier(0.16, 1, 0.3, 1);
          }

          .flight-ticket .flight-ticket-stub {
            transition:
              transform 780ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 520ms ease;
          }

          .flight-ticket.cutting,
          .flight-ticket.cutting .flight-ticket-stub {
            animation: none !important;
          }

          .flight-ticket.ticket-used .flight-ticket-stub {
            opacity: 0 !important;
            transform: translateX(128px) rotate(10deg) !important;
            pointer-events: none;
          }

          .flight-ticket.ticket-used .flight-ticket-main {
            border-right: 2px dashed rgba(37,99,235,0.28);
          }

          .flight-feature-shell {
            overflow: hidden;
            transform-origin: top center;
            transition:
              max-height 620ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 420ms cubic-bezier(0.16, 1, 0.3, 1),
              margin-bottom 520ms cubic-bezier(0.16, 1, 0.3, 1);
          }

          .flight-feature-shell.open {
            max-height: 2600px;
            opacity: 1;
            pointer-events: auto;
          }

          .flight-feature-shell.closed {
            max-height: 0;
            opacity: 0;
            pointer-events: none;
          }

          .flight-feature-shell.closed * {
            pointer-events: none !important;
          }

          /* Prevent subtle size pulsing caused by scale-based entrance animations */
          section,
          aside,
          .flight-dashboard-card,
          .flight-side-card,
          .flight-toggle-card {
            transform-origin: center center;
          }

          /* Stability patch: cards must not pulse, bounce, or change size during timer updates. */
          main,
          aside,
          section,
          [style*="var(--card-bg)"],
          .flight-dashboard-card,
          .flight-side-card,
          .flight-status-panel-inner,
          .flight-ticket-panel-inner {
            animation-name: none;
          }

          .flight-feature-shell,
          .flight-feature-shell * {
            will-change: opacity, max-height;
          }

          /* Final stability patch: cards and sections must never shift during timer updates. */
          main,
          aside,
          section,
          .mobile-home-item,
          .right-panel-item,
          .flight-side-card,
          .flight-dashboard-card,
          .flight-status-panel-inner,
          .flight-ticket-panel-inner {
            animation: none !important;
            transition-property: background-color, color, border-color, box-shadow, opacity !important;
          }

          main,
          aside,
          section {
            transform: none !important;
          }

          /* Keep the app usable on phones as easy mode instead of showing the old blocking screen. */
          @media (max-width: 900px) {
            body {
              overflow-x: hidden;
            }
          }

          .easy-flight-toggle-card {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: center;
            background:
              radial-gradient(circle at 12% 0%, rgba(14,165,233,0.14), transparent 28%),
              linear-gradient(135deg, rgba(255,255,255,0.98), rgba(239,246,255,0.94));
            border: 1px solid rgba(191,219,254,0.95);
            border-radius: 24px;
            padding: 14px;
            box-shadow: 0 10px 26px rgba(37,99,235,0.07);
          }

          .easy-flight-toggle-card h3 {
            margin: 3px 0;
            color: #0f172a;
            font-size: 18px;
            letter-spacing: -0.45px;
          }

          .easy-flight-toggle-card p {
            margin: 0;
            color: #64748b;
            font-size: 12px;
            font-weight: 750;
            line-height: 1.4;
          }

          .easy-flight-toggle-card button,
          .easy-flight-controls button {
            border: 1px solid rgba(191,219,254,0.95);
            border-radius: 16px;
            background: linear-gradient(135deg, #2563eb, #0ea5e9);
            color: white;
            font-weight: 950;
            min-height: 42px;
            padding: 0 14px;
          }

          .easy-flight-controls {
            display: grid;
            gap: 10px;
            margin-top: 10px;
            margin-bottom: 12px;
          }

          .easy-flight-ticket,
          .easy-flight-progress,
          .easy-flight-actions {
            border: 1px solid rgba(191,219,254,0.95);
            border-radius: 22px;
            background: rgba(255,255,255,0.96);
            padding: 13px;
            box-shadow: 0 10px 26px rgba(37,99,235,0.06);
          }

          .easy-flight-ticket {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: center;
          }

          .easy-flight-ticket h3 {
            margin: 3px 0;
            color: #0f172a;
            font-size: 20px;
            letter-spacing: -0.7px;
          }

          .easy-flight-ticket p {
            margin: 0;
            color: #64748b;
            font-size: 12px;
            font-weight: 750;
            line-height: 1.35;
          }

          .easy-flight-ticket span,
          .easy-flight-actions span,
          .easy-flight-actions small,
          .easy-flight-progress span {
            display: block;
            color: #64748b;
            font-size: 11px;
            font-weight: 850;
          }

          .easy-flight-ticket b,
          .easy-flight-actions b,
          .easy-flight-progress b {
            color: #0f172a;
            font-weight: 950;
          }

          .easy-flight-progress > div:first-child {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            align-items: center;
            margin-bottom: 8px;
          }

          .easy-flight-actions {
            display: grid;
            gap: 10px;
          }

          @media (max-width: 900px) {
            .easy-flight-toggle-card {
              display: grid;
            }

            .easy-flight-toggle-card button {
              width: 100%;
            }

            .easy-flight-ticket {
              display: grid;
            }

            .flight-dashboard-card {
              padding: 12px !important;
              border-radius: 24px !important;
            }

            .flight-dashboard-head {
              display: grid !important;
              gap: 10px !important;
            }

            .flight-map-viewport {
              height: 420px !important;
              min-height: 380px !important;
            }

            .flight-dashboard-card .flight-country {
              min-width: 34px !important;
              height: 30px !important;
              font-size: 10px !important;
            }
          }

          .easy-flight-boarding-pass {
            min-height: 188px;
          }

          .easy-flight-boarding-pass .flight-ticket-main h2 {
            font-size: 34px;
          }

          .easy-flight-boarding-pass .flight-ticket-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .easy-flight-progress.detailed {
            display: grid;
            gap: 10px;
          }

          .easy-flight-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          @media (max-width: 900px) {
            .easy-flight-boarding-pass {
              grid-template-columns: minmax(0, 1fr) 74px !important;
              min-height: 174px;
            }

            .easy-flight-boarding-pass .flight-ticket-main {
              padding: 15px;
            }

            .easy-flight-boarding-pass .flight-ticket-main h2 {
              font-size: 28px;
            }

            .easy-flight-boarding-pass .flight-ticket-row {
              grid-template-columns: 1fr;
              gap: 7px;
            }

            .easy-flight-stats {
              grid-template-columns: 1fr 1fr;
            }
          }

          /* 1~3번 수정 전용: 비행 경로 자체는 고정하고 비행기만 부드럽게 이동 */
          .flight-route-line {
            animation: none !important;
            stroke-dashoffset: 0 !important;
          }

          .dev-time-toggle {
            position: fixed;
            right: 18px;
            bottom: 18px;
            z-index: 95;
            width: 48px;
            height: 48px;
            border: 0;
            border-radius: 18px;
            background: linear-gradient(135deg, #111827, #2563eb);
            color: white;
            font-size: 12px;
            font-weight: 950;
            box-shadow: 0 16px 36px rgba(15,23,42,0.22);
            cursor: pointer;
          }

          .dev-time-panel {
            position: fixed;
            right: 18px;
            bottom: 76px;
            z-index: 96;
            width: min(360px, calc(100vw - 36px));
            background: rgba(255,255,255,0.98);
            border: 1px solid rgba(191,219,254,0.95);
            border-radius: 24px;
            padding: 14px;
            box-shadow: 0 18px 46px rgba(15,23,42,0.16);
          }

          .dev-time-head {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            align-items: flex-start;
            margin-bottom: 12px;
          }

          .dev-time-head b {
            display: block;
            color: #0f172a;
            font-size: 15px;
            font-weight: 950;
          }

          .dev-time-head span,
          .dev-time-controls p {
            color: #64748b;
            font-size: 12px;
            line-height: 1.45;
          }

          .dev-time-head button {
            border: 0;
            background: #f1f5f9;
            color: #334155;
            border-radius: 999px;
            width: 28px;
            height: 28px;
            font-weight: 950;
            cursor: pointer;
          }

          .dev-time-login {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 8px;
          }

          .dev-time-login input {
            border: 1px solid #dbeafe;
            border-radius: 14px;
            padding: 10px 12px;
            background: #f8fafc;
            color: #0f172a;
            min-width: 0;
          }

          .dev-time-login button,
          .dev-time-grid button {
            border: 0;
            border-radius: 14px;
            background: #2563eb;
            color: white;
            font-weight: 950;
            padding: 10px 12px;
            cursor: pointer;
          }

          .dev-time-current {
            border-radius: 18px;
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            padding: 12px;
            margin-bottom: 10px;
          }

          .dev-time-current span {
            display: block;
            color: #64748b;
            font-size: 11px;
            font-weight: 900;
          }

          .dev-time-current b {
            display: block;
            margin-top: 2px;
            color: #1e40af;
            font-size: 20px;
            font-weight: 950;
          }

          .dev-time-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
          }

          .dev-time-controls p {
            margin: 10px 0 0;
          }

          @media (max-width: 720px) {
            .dev-time-toggle {
              right: 14px;
              bottom: 76px;
            }

            .dev-time-panel {
              right: 14px;
              bottom: 132px;
            }
          }

          .meal-block-form {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 110px 110px auto;
            gap: 6px;
            margin: 8px 0 10px;
          }

          .meal-block-form select,
          .meal-block-form input {
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 8px 9px;
            background: var(--input-bg);
            color: var(--text-main);
            min-width: 0;
          }

          .meal-block-form button {
            border: 0;
            border-radius: 12px;
            padding: 8px 10px;
            background: #fb923c;
            color: white;
            font-weight: 900;
            cursor: pointer;
          }

          .meal-block-list {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin: 4px 0 10px;
          }

          .meal-block-list span {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            border-radius: 999px;
            padding: 5px 8px;
            background: #fff7ed;
            border: 1px solid #fed7aa;
            color: #9a3412;
            font-size: 12px;
            font-weight: 850;
          }

          .meal-block-list button {
            border: 0;
            background: transparent;
            color: inherit;
            cursor: pointer;
            font-weight: 950;
          }

          @media (max-width: 720px) {
            .meal-block-form {
              grid-template-columns: 1fr 1fr;
            }
          }

          .flight-live-edit {
            display: grid;
            gap: 6px;
            margin-top: 8px;
          }

          .flight-live-edit select,
          .flight-live-edit input {
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 8px 9px;
            background: var(--input-bg);
            color: var(--text-main);
            min-width: 0;
          }

          .flight-live-edit button {
            border: 1px solid rgba(191,219,254,0.95);
            border-radius: 14px;
            background: #eff6ff;
            color: #1e40af;
            font-weight: 950;
            padding: 8px 10px;
            cursor: pointer;
          }

          /* Zoom fix: 확대/축소 보정은 JS가 즉시 수행하므로 smooth scroll을 끕니다. */
          .flight-map-viewport {
            scroll-behavior: auto !important;
            overflow-anchor: none;
          }

          /* 11번: 점선 이동 애니메이션 제거. 비행기만 부드럽게 움직이게 유지 */
          .flight-route-line,
          .flight-dashboard-card .flight-route-line,
          .flight-dashboard-card.tracking-flight .flight-route-line {
            animation: none !important;
            stroke-dashoffset: 0 !important;
          }

          .flight-fullscreen {
            position: fixed;
            inset: 0;
            z-index: 130;
            background: rgba(248,251,255,0.98);
            padding: 16px;
            box-sizing: border-box;
            overflow: auto;
          }

          .flight-fullscreen-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
          }

          .flight-fullscreen-top h2 {
            margin: 2px 0 0;
            color: #0f172a;
            font-size: 28px;
          }

          .flight-fullscreen-top button {
            border: 1px solid #bfdbfe;
            border-radius: 16px;
            background: #eff6ff;
            color: #1e40af;
            font-weight: 950;
            padding: 10px 14px;
            cursor: pointer;
          }

          .flight-fullscreen-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(320px, 390px);
            gap: 12px;
            align-items: start;
          }

          .flight-fullscreen-map .flight-dashboard-card {
            min-height: calc(100vh - 116px);
          }

          .flight-fullscreen-map .flight-map-viewport {
            height: calc(100vh - 280px) !important;
            min-height: 520px !important;
          }

          .flight-fullscreen-side {
            display: grid;
            gap: 12px;
          }

          @media (max-width: 1100px) {
            .flight-fullscreen-grid {
              grid-template-columns: 1fr;
            }
          }

          .flight-fullscreen-open {
            border: 1px solid rgba(191,219,254,0.95);
            border-radius: 999px;
            background: #eff6ff;
            color: #1e40af;
            font-size: 11px;
            font-weight: 950;
            padding: 7px 10px;
            cursor: pointer;
            white-space: nowrap;
          }

          .flight-route-summary .flight-fullscreen-open {
            margin-left: 2px;
          }

          .dark-app {
            background: #0b1220;
          }

          .dark-app img {
            filter: brightness(0.92) contrast(1.05);
          }

          .dark-app .flight-fullscreen,
          .dark-app .flight-dashboard-card,
          .dark-app .flight-side-card {
            color: var(--text-main);
          }

          .dark-app .flight-map-viewport {
            background: #0f172a;
            border-color: rgba(96,165,250,0.34);
          }

          .dark-app {
            color-scheme: dark;
          }

          .dark-app section,
          .dark-app aside,
          .dark-app main {
            color: var(--text-main);
          }

          .dark-app .flight-os,
          .dark-app .flight-fullscreen {
            background:
              radial-gradient(circle at 16% 0%, rgba(37,99,235,0.20), transparent 32%),
              radial-gradient(circle at 92% 18%, rgba(14,165,233,0.14), transparent 34%),
              linear-gradient(135deg, #020617 0%, #0f172a 54%, #111827 100%) !important;
            border-color: rgba(96,165,250,0.28) !important;
            color: var(--text-main) !important;
          }

          .dark-app .flight-topbar,
          .dark-app .flight-ticket,
          .dark-app .flight-side-card,
          .dark-app .flight-current-study,
          .dark-app .flight-status-panel-inner,
          .dark-app .dev-time-panel,
          .dark-app .easy-flight-toggle-card {
            background: rgba(15,23,42,0.94) !important;
            border-color: rgba(96,165,250,0.28) !important;
            color: var(--text-main) !important;
          }

          .dark-app .flight-ticket-row div,
          .dark-app .flight-stats div,
          .dark-app .flight-sound-box,
          .dark-app .flight-member-list div,
          .dark-app .dev-time-current {
            background: rgba(30,41,59,0.82) !important;
            border-color: rgba(96,165,250,0.24) !important;
            color: var(--text-main) !important;
          }

          .dark-app .flight-route-summary span,
          .dark-app .flight-os button,
          .dark-app .flight-live-edit button,
          .dark-app .flight-fullscreen-open,
          .dark-app .flight-fullscreen-top button,
          .dark-app .dev-time-login button,
          .dark-app .dev-time-grid button {
            background: rgba(30,41,59,0.92) !important;
            border-color: rgba(96,165,250,0.34) !important;
            color: #dbeafe !important;
          }

          .dark-app .flight-mode-tabs button.active,
          .dark-app .flight-os button:hover {
            background: linear-gradient(135deg, var(--accent), var(--accent-dark)) !important;
            color: #ffffff !important;
          }

          .dark-app .flight-os input,
          .dark-app .flight-os select,
          .dark-app .flight-os textarea,
          .dark-app .dev-time-login input,
          .dark-app .flight-live-edit input,
          .dark-app .flight-live-edit select {
            background: #1e293b !important;
            color: #e5e7eb !important;
            border-color: rgba(96,165,250,0.28) !important;
          }

          .dark-app .flight-map-viewport {
            background: #0f172a !important;
            border-color: rgba(96,165,250,0.30) !important;
          }

          .dark-app .flight-ticket-main p,
          .dark-app .flight-route-summary small,
          .dark-app .flight-stats span,
          .dark-app .flight-current-study span,
          .dark-app .dev-time-head span,
          .dark-app .dev-time-controls p {
            color: #94a3b8 !important;
          }

          .dark-app .meal-block-list span {
            background: rgba(154,52,18,0.25) !important;
            border-color: rgba(251,146,60,0.36) !important;
            color: #fed7aa !important;
          }

          .dark-app [style*="#fff7ed"],
          .dark-app [style*="#fff1f2"],
          .dark-app [style*="#fef2f2"],
          .dark-app [style*="#f8fafc"],
          .dark-app [style*="#f2f4f6"],
          .dark-app [style*="#edf4ff"],
          .dark-app [style*="rgb(255, 255, 255)"] {
            background: rgba(15,23,42,0.88) !important;
            color: var(--text-main) !important;
            border-color: var(--border) !important;
          }

          .dark-app .sr-logo-text {
            fill: #dbeafe;
          }

          /* Dark mode coverage patch */
          .dark-app .flight-dashboard-card,
          .dark-app .easy-flight-toggle-card,
          .dark-app .easy-flight-ticket,
          .dark-app .easy-flight-progress,
          .dark-app .easy-flight-actions,
          .dark-app .easy-flight-controls,
          .dark-app .flight-ticket,
          .dark-app .easy-flight-boarding-pass {
            background:
              radial-gradient(circle at 12% 0%, rgba(37,99,235,0.18), transparent 30%),
              linear-gradient(135deg, rgba(15,23,42,0.96), rgba(17,24,39,0.94)) !important;
            border-color: rgba(96,165,250,0.32) !important;
            color: var(--text-main) !important;
            box-shadow: 0 12px 30px rgba(0,0,0,0.24) !important;
          }

          .dark-app .flight-dashboard-card h2,
          .dark-app .flight-dashboard-card h3,
          .dark-app .flight-dashboard-card b,
          .dark-app .easy-flight-toggle-card h3,
          .dark-app .easy-flight-toggle-card b,
          .dark-app .easy-flight-ticket h3,
          .dark-app .easy-flight-ticket b,
          .dark-app .easy-flight-progress b,
          .dark-app .easy-flight-actions b,
          .dark-app .flight-ticket-main h2,
          .dark-app .flight-ticket-main b,
          .dark-app .flight-ticket-stub b {
            color: #e5e7eb !important;
          }

          .dark-app .flight-dashboard-card p,
          .dark-app .flight-dashboard-card span,
          .dark-app .flight-dashboard-card small,
          .dark-app .easy-flight-toggle-card p,
          .dark-app .easy-flight-ticket p,
          .dark-app .easy-flight-ticket span,
          .dark-app .easy-flight-actions span,
          .dark-app .easy-flight-actions small,
          .dark-app .easy-flight-progress span,
          .dark-app .flight-ticket-main p,
          .dark-app .flight-ticket-main span,
          .dark-app .flight-ticket-main small,
          .dark-app .flight-ticket-stub span,
          .dark-app .flight-ticket-stub small {
            color: #94a3b8 !important;
          }

          .dark-app .flight-ticket-row div,
          .dark-app .flight-stats div,
          .dark-app .flight-current-study,
          .dark-app .flight-live-edit,
          .dark-app .flight-panel-head,
          .dark-app .flight-map-tools {
            background: rgba(30,41,59,0.82) !important;
            border-color: rgba(96,165,250,0.25) !important;
            color: var(--text-main) !important;
          }

          .dark-app .flight-route-summary span,
          .dark-app .flight-zoom-controls,
          .dark-app .flight-pick-tabs {
            background: rgba(30,41,59,0.86) !important;
            border-color: rgba(96,165,250,0.28) !important;
            color: #dbeafe !important;
          }

          .dark-app .flight-map-viewport,
          .dark-app .flight-map {
            background-color: #0f172a !important;
            border-color: rgba(96,165,250,0.30) !important;
          }

          .dark-app [style*="현재 위치 기준 7일 예보"],
          .dark-app [style*="PERSONAL STUDY PLANNER"] {
            background: rgba(15,23,42,0.96) !important;
            color: var(--text-main) !important;
            border-color: var(--border) !important;
          }

          .dark-app [style*="linear-gradient(180deg, #ffffff"],
          .dark-app [style*="rgba(255,255,255"],
          .dark-app [style*="rgba(255, 255, 255"],
          .dark-app [style*="#fbfcfd"],
          .dark-app [style*="#f8fbff"],
          .dark-app [style*="#f8fafc"],
          .dark-app [style*="#eff6ff"],
          .dark-app [style*="#edf4ff"],
          .dark-app [style*="#f2f4f6"] {
            background: rgba(15,23,42,0.94) !important;
            color: var(--text-main) !important;
            border-color: var(--border) !important;
          }

          .dark-app [style*="#0f172a"],
          .dark-app [style*="#191f28"],
          .dark-app [style*="#334155"] {
            color: var(--text-main) !important;
          }

          .dark-app .flight-live-edit input,
          .dark-app .flight-live-edit select,
          .dark-app .flight-os input,
          .dark-app .flight-os select,
          .dark-app .flight-os textarea {
            background: #1e293b !important;
            color: #e5e7eb !important;
            border-color: rgba(96,165,250,0.32) !important;
          }

          /* Dark mode final coverage: planner, chat, flight status, boarding button, password box */
          .dark-app [style*="나의 공부 달력"],
          .dark-app [style*="플래너"],
          .dark-app [style*="white"],
          .dark-app [style*="#f9fafb"],
          .dark-app [style*="#e4e4e7"],
          .dark-app [style*="#fef3c7"],
          .dark-app [style*="#f8fafc"],
          .dark-app [style*="#f2f4f6"],
          .dark-app [style*="#e8f3ff"],
          .dark-app [style*="rgba(255,255,255"],
          .dark-app [style*="rgba(255, 255, 255"] {
            background: rgba(15,23,42,0.94) !important;
            color: var(--text-main) !important;
            border-color: var(--border) !important;
          }

          .dark-app [style*="#18181b"] {
            color: var(--text-main) !important;
          }

          .dark-app [style*="#334155"],
          .dark-app [style*="#0f172a"],
          .dark-app [style*="#1e40af"],
          .dark-app [style*="#1b64da"] {
            color: var(--text-main) !important;
          }

          .dark-app [style*="#64748b"],
          .dark-app [style*="#71717a"],
          .dark-app [style*="#6b7684"] {
            color: var(--text-sub) !important;
          }

          .dark-app .flight-ticket-main,
          .dark-app .flight-ticket-stub,
          .dark-app .flight-ticket-row div,
          .dark-app .flight-status-panel-inner,
          .dark-app .flight-side-card,
          .dark-app .easy-flight-progress,
          .dark-app .easy-flight-actions,
          .dark-app .easy-flight-boarding-pass {
            background: rgba(15,23,42,0.96) !important;
            color: var(--text-main) !important;
            border-color: rgba(96,165,250,0.34) !important;
          }

          .dark-app .flight-ticket-main span,
          .dark-app .flight-ticket-main h2,
          .dark-app .flight-ticket-main p,
          .dark-app .flight-ticket-main small,
          .dark-app .flight-ticket-main b,
          .dark-app .flight-ticket-stub span,
          .dark-app .flight-ticket-stub b,
          .dark-app .flight-ticket-stub small,
          .dark-app .flight-status-panel-inner span,
          .dark-app .flight-status-panel-inner b,
          .dark-app .flight-side-card span,
          .dark-app .flight-side-card b,
          .dark-app .flight-side-card small,
          .dark-app .easy-flight-progress span,
          .dark-app .easy-flight-progress b {
            color: var(--text-main) !important;
          }

          .dark-app .flight-ticket-main p,
          .dark-app .flight-ticket-main small,
          .dark-app .flight-ticket-stub span,
          .dark-app .flight-ticket-stub small,
          .dark-app .flight-status-panel-inner span,
          .dark-app .flight-side-card span,
          .dark-app .flight-side-card small,
          .dark-app .easy-flight-progress span {
            color: var(--text-sub) !important;
          }

          .dark-app .flight-study-form button,
          .dark-app .flight-action-only button,
          .dark-app .flight-stop,
          .dark-app button[disabled] {
            color: #e5e7eb !important;
          }

          .dark-app input,
          .dark-app select,
          .dark-app textarea {
            background: #1e293b !important;
            color: #e5e7eb !important;
            border-color: rgba(96,165,250,0.30) !important;
          }

          .dark-app input::placeholder,
          .dark-app textarea::placeholder {
            color: #94a3b8 !important;
          }

          /* Final patch: planner hero + flight map controls in dark mode */
          .dark-app .planner-hero {
            background: linear-gradient(135deg, rgba(30,41,59,0.96), rgba(15,23,42,0.98)) !important;
            color: #e5e7eb !important;
            border-color: rgba(96,165,250,0.32) !important;
          }

          .dark-app .planner-hero *,
          .dark-app .planner-hero h2,
          .dark-app .planner-hero h3,
          .dark-app .planner-hero b,
          .dark-app .planner-hero div {
            color: #e5e7eb !important;
          }

          .dark-app .flight-pick-tabs,
          .dark-app .flight-zoom-controls {
            background: rgba(15,23,42,0.92) !important;
            border: 1px solid rgba(96,165,250,0.30) !important;
            color: #dbeafe !important;
          }

          .dark-app .flight-pick-tabs button,
          .dark-app .flight-zoom-controls button,
          .dark-app .flight-zoom-controls span {
            background: rgba(30,41,59,0.92) !important;
            color: #dbeafe !important;
            border: 1px solid rgba(96,165,250,0.32) !important;
            box-shadow: none !important;
          }

          .dark-app .flight-pick-tabs button.active,
          .dark-app .flight-zoom-controls button:hover,
          .dark-app .flight-pick-tabs button:hover {
            background: linear-gradient(135deg, var(--accent), var(--accent-dark)) !important;
            color: #ffffff !important;
            border-color: rgba(147,197,253,0.55) !important;
          }

          .dark-app .flight-pick-tabs button:disabled,
          .dark-app .flight-zoom-controls button:disabled {
            opacity: 0.55;
            color: #94a3b8 !important;
          }

          /* Strong final dark-mode patch: no sharp flight controls, no eye-burning white blocks */
          .flight-pick-tabs,
          .flight-zoom-controls {
            border-radius: 999px !important;
            overflow: hidden !important;
            clip-path: inset(0 round 999px);
          }

          .flight-pick-tabs button,
          .flight-zoom-controls button,
          .flight-zoom-controls span {
            border-radius: 999px !important;
          }

          .dark-app .flight-pick-tabs,
          .dark-app .flight-zoom-controls {
            background: rgba(15,23,42,0.96) !important;
            border: 1px solid rgba(96,165,250,0.34) !important;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.035) !important;
          }

          .dark-app .flight-pick-tabs button,
          .dark-app .flight-zoom-controls button,
          .dark-app .flight-zoom-controls span {
            background: rgba(30,41,59,0.94) !important;
            color: #dbeafe !important;
            border: 1px solid rgba(96,165,250,0.28) !important;
          }

          .dark-app .flight-pick-tabs button.active {
            background: linear-gradient(135deg, var(--accent), var(--accent-dark)) !important;
            color: #ffffff !important;
          }

          .dark-app .flight-pick-tabs button:disabled,
          .dark-app .flight-zoom-controls button:disabled {
            background: rgba(15,23,42,0.78) !important;
            color: #64748b !important;
            border-color: rgba(71,85,105,0.65) !important;
          }

          /*
            Broad dark-mode safety net.
            Some cards still use inline light backgrounds, so this catches the remaining
            white-ish values without affecting light mode.
          */
          .dark-app [style*="background: white"],
          .dark-app [style*="background:white"],
          .dark-app [style*=": white"],
          .dark-app [style*="rgb(255, 255, 255)"],
          .dark-app [style*="rgba(255,255,255"],
          .dark-app [style*="rgba(255, 255, 255"],
          .dark-app [style*="#ffffff"],
          .dark-app [style*="#fff"],
          .dark-app [style*="#fbfcfd"],
          .dark-app [style*="#f9fafb"],
          .dark-app [style*="#f8fafc"],
          .dark-app [style*="#f8fbff"],
          .dark-app [style*="#f7f8fa"],
          .dark-app [style*="#f2f4f6"],
          .dark-app [style*="#eff6ff"],
          .dark-app [style*="#edf4ff"],
          .dark-app [style*="#e4e4e7"],
          .dark-app [style*="#e5e7eb"],
          .dark-app [style*="#e5e8eb"],
          .dark-app [style*="#eef1f4"] {
            background: rgba(15,23,42,0.94) !important;
            color: var(--text-main) !important;
            border-color: var(--border) !important;
          }

          .dark-app [style*="linear-gradient(135deg, #ffffff"],
          .dark-app [style*="linear-gradient(180deg, #ffffff"],
          .dark-app [style*="linear-gradient(135deg, var(--accent-soft)"],
          .dark-app [style*="linear-gradient(180deg, var(--accent-soft)"] {
            background: linear-gradient(135deg, rgba(30,41,59,0.96), rgba(15,23,42,0.98)) !important;
            color: var(--text-main) !important;
            border-color: rgba(96,165,250,0.28) !important;
          }

          .dark-app [style*="color: #0f172a"],
          .dark-app [style*="color:#0f172a"],
          .dark-app [style*="color: #18181b"],
          .dark-app [style*="color:#18181b"],
          .dark-app [style*="color: #191f28"],
          .dark-app [style*="color:#191f28"],
          .dark-app [style*="color: #334155"],
          .dark-app [style*="color:#334155"],
          .dark-app [style*="color: #1e40af"],
          .dark-app [style*="color:#1e40af"],
          .dark-app [style*="color: #1b64da"],
          .dark-app [style*="color:#1b64da"] {
            color: var(--text-main) !important;
          }

          .dark-app [style*="color: #64748b"],
          .dark-app [style*="color:#64748b"],
          .dark-app [style*="color: #71717a"],
          .dark-app [style*="color:#71717a"],
          .dark-app [style*="color: #6b7684"],
          .dark-app [style*="color:#6b7684"],
          .dark-app [style*="color: #8b95a1"],
          .dark-app [style*="color:#8b95a1"] {
            color: var(--text-sub) !important;
          }

          .dark-app input,
          .dark-app select,
          .dark-app textarea {
            background: #1e293b !important;
            color: #e5e7eb !important;
            border-color: rgba(96,165,250,0.30) !important;
          }

          .dark-app option {
            background: #111827 !important;
            color: #e5e7eb !important;
          }

          .dark-app button {
            border-radius: 16px;
          }

          /* World route map rounded-container patch */
          .flight-dashboard-card,
          .flight-dashboard-grid,
          .flight-dashboard-grid > div,
          .flight-panel-head,
          .flight-map-tools,
          .flight-pick-tabs,
          .flight-zoom-controls {
            border-radius: 24px !important;
          }

          .flight-panel-head {
            overflow: hidden !important;
            padding: 10px 12px;
            border: 1px solid rgba(191,219,254,0.70);
            background: rgba(239,246,255,0.70);
          }

          .flight-map-tools {
            overflow: hidden !important;
          }

          .flight-pick-tabs,
          .flight-zoom-controls {
            border-radius: 999px !important;
            overflow: hidden !important;
            clip-path: inset(0 round 999px);
          }

          .flight-pick-tabs button,
          .flight-zoom-controls button,
          .flight-zoom-controls span {
            border-radius: 999px !important;
          }

          .dark-app .flight-panel-head,
          .dark-app .flight-map-tools {
            background: rgba(15,23,42,0.92) !important;
            border-color: rgba(96,165,250,0.30) !important;
            color: var(--text-main) !important;
          }

          .dark-app .flight-pick-tabs,
          .dark-app .flight-zoom-controls {
            background: rgba(15,23,42,0.96) !important;
            border-color: rgba(96,165,250,0.34) !important;
            color: #dbeafe !important;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.035) !important;
          }

          .dark-app .flight-pick-tabs button,
          .dark-app .flight-zoom-controls button,
          .dark-app .flight-zoom-controls span {
            background: rgba(30,41,59,0.94) !important;
            color: #dbeafe !important;
            border: 1px solid rgba(96,165,250,0.28) !important;
            box-shadow: none !important;
          }

          .dark-app .flight-pick-tabs button.active,
          .dark-app .flight-pick-tabs button:hover,
          .dark-app .flight-zoom-controls button:hover {
            background: linear-gradient(135deg, var(--accent), var(--accent-dark)) !important;
            color: #ffffff !important;
            border-color: rgba(147,197,253,0.55) !important;
          }

          /* Weather dark patch */
          .dark-app .weather-card,
          .dark-app [data-card-id="weather"],
          .dark-app [style*="현재 위치 기준 7일 예보"],
          .dark-app [style*="위치 권한을 허용"],
          .dark-app [style*="날씨를 불러오지"] {
            background: rgba(15,23,42,0.94) !important;
            color: var(--text-main) !important;
            border-color: rgba(96,165,250,0.28) !important;
          }

          /* General final dark safety net for remaining light chips/cards */
          .dark-app [style*="background: white"],
          .dark-app [style*="background:white"],
          .dark-app [style*="rgb(255, 255, 255)"],
          .dark-app [style*="rgba(255,255,255"],
          .dark-app [style*="rgba(255, 255, 255"],
          .dark-app [style*="#ffffff"],
          .dark-app [style*="#fff"],
          .dark-app [style*="#fbfcfd"],
          .dark-app [style*="#f9fafb"],
          .dark-app [style*="#f8fafc"],
          .dark-app [style*="#f8fbff"],
          .dark-app [style*="#f7f8fa"],
          .dark-app [style*="#f2f4f6"],
          .dark-app [style*="#eff6ff"],
          .dark-app [style*="#edf4ff"],
          .dark-app [style*="#e8f3ff"] {
            background: rgba(15,23,42,0.94) !important;
            color: var(--text-main) !important;
            border-color: var(--border) !important;
          }

          .dark-app [style*="color: #0f172a"],
          .dark-app [style*="color:#0f172a"],
          .dark-app [style*="color: #18181b"],
          .dark-app [style*="color:#18181b"],
          .dark-app [style*="color: #191f28"],
          .dark-app [style*="color:#191f28"],
          .dark-app [style*="color: #334155"],
          .dark-app [style*="color:#334155"],
          .dark-app [style*="color: #1e40af"],
          .dark-app [style*="color:#1e40af"],
          .dark-app [style*="color: #1b64da"],
          .dark-app [style*="color:#1b64da"] {
            color: var(--text-main) !important;
          }

          .easy-bottom-nav {
            overflow: hidden;
          }

          .dark-app .easy-bottom-nav {
            background: rgba(15,23,42,0.96) !important;
            border-color: rgba(96,165,250,0.30) !important;
          }

          .dark-app .easy-bottom-nav button {
            background: rgba(30,41,59,0.58) !important;
            color: var(--text-sub) !important;
            border-color: rgba(96,165,250,0.16) !important;
          }

          .dark-app .easy-bottom-nav button:hover {
            background: rgba(30,41,59,0.82) !important;
          }

          /* Requested dark action buttons */
          .dark-app .danger-action-button {
            background: rgba(127,29,29,0.34) !important;
            color: #fecaca !important;
            border-color: rgba(248,113,113,0.45) !important;
          }

          .dark-app .boarding-action-button {
            background: linear-gradient(135deg, #2563eb, #0ea5e9) !important;
            color: #ffffff !important;
            border-color: rgba(147,197,253,0.62) !important;
            box-shadow: 0 12px 28px rgba(37,99,235,0.28) !important;
          }

          .dark-app .landing-action-button,
          .dark-app .flight-stop {
            background: linear-gradient(135deg, #7f1d1d, #991b1b) !important;
            color: #fee2e2 !important;
            border-color: rgba(248,113,113,0.48) !important;
            box-shadow: 0 12px 28px rgba(127,29,29,0.28) !important;
          }

          /* Dark mode world map recolor */
          .dark-app .flight-map-viewport {
            background:
              radial-gradient(circle at 20% 10%, rgba(37,99,235,0.20), transparent 30%),
              linear-gradient(135deg, #020617 0%, #0f172a 55%, #111827 100%) !important;
            border-color: rgba(96,165,250,0.34) !important;
          }

          .dark-app .flight-map {
            background:
              radial-gradient(circle at 50% 45%, rgba(14,165,233,0.18), transparent 36%),
              linear-gradient(135deg, #07111f 0%, #0f172a 100%) !important;
          }

          .dark-app .flight-map-grid {
            background:
              linear-gradient(rgba(96,165,250,0.09) 1px, transparent 1px),
              linear-gradient(90deg, rgba(96,165,250,0.09) 1px, transparent 1px),
              radial-gradient(circle at 50% 48%, rgba(37,99,235,0.22), transparent 42%) !important;
            background-size: 48px 48px, 48px 48px, auto !important;
          }

          .dark-app .flight-route-line {
            stroke: #38bdf8 !important;
            filter:
              drop-shadow(0 0 8px rgba(56,189,248,0.75))
              drop-shadow(0 8px 10px rgba(14,165,233,0.22)) !important;
          }

          .dark-app .flight-country {
            background: rgba(15,23,42,0.90) !important;
            color: #bae6fd !important;
            border-color: rgba(56,189,248,0.55) !important;
            box-shadow: 0 0 0 1px rgba(14,165,233,0.08), 0 8px 18px rgba(0,0,0,0.30) !important;
          }

          .dark-app .flight-country.selected {
            background: linear-gradient(135deg, #0891b2, #2563eb) !important;
            color: #ffffff !important;
            border-color: rgba(186,230,253,0.72) !important;
            box-shadow: 0 0 20px rgba(56,189,248,0.38), 0 10px 24px rgba(37,99,235,0.36) !important;
          }

          .dark-app .flight-country::after {
            color: #bae6fd !important;
            text-shadow: 0 0 10px rgba(56,189,248,0.40);
          }

          /* Visual timetable like the reference image */
          .visual-timetable-wrap {
            margin-top: 10px;
            overflow: auto;
            border: 1px solid var(--border);
            border-radius: 18px;
            background: var(--card-bg-solid);
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.35);
          }

          .visual-timetable {
            position: relative;
            min-width: 270px;
            background:
              linear-gradient(to bottom, var(--border) 1px, transparent 1px),
              linear-gradient(to right, transparent 0 64px, var(--border) 64px 65px, transparent 65px),
              linear-gradient(to right, transparent 0, transparent 20%, rgba(148,163,184,0.22) 20% calc(20% + 1px), transparent calc(20% + 1px)),
              linear-gradient(to right, transparent 0, transparent 40%, rgba(148,163,184,0.22) 40% calc(40% + 1px), transparent calc(40% + 1px)),
              linear-gradient(to right, transparent 0, transparent 60%, rgba(148,163,184,0.22) 60% calc(60% + 1px), transparent calc(60% + 1px)),
              linear-gradient(to right, transparent 0, transparent 80%, rgba(148,163,184,0.22) 80% calc(80% + 1px), transparent calc(80% + 1px));
            background-size:
              100% var(--tt-row-height),
              100% 100%,
              100% 100%,
              100% 100%,
              100% 100%,
              100% 100%;
          }

          .visual-timetable-labels {
            position: absolute;
            inset: 0 auto 0 0;
            width: 64px;
            z-index: 2;
            border-right: 1px solid var(--border);
            background: color-mix(in srgb, var(--card-bg-solid) 82%, transparent);
          }

          .visual-timetable-hour {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-mid);
            font-size: 12px;
            font-weight: 850;
            border-bottom: 1px solid var(--border);
          }

          .visual-timetable-grid {
            position: absolute;
            inset: 0;
            pointer-events: none;
          }

          .visual-timetable-block {
            position: absolute;
            z-index: 3;
            border: 1px solid;
            border-radius: 999px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 10px;
            min-width: 92px;
            box-sizing: border-box;
            font-size: 12px;
            font-weight: 900;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            box-shadow: 0 8px 16px rgba(15,23,42,0.08);
            backdrop-filter: blur(8px);
          }

          .visual-timetable-block span {
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .dark-app .visual-timetable-wrap {
            background: rgba(15,23,42,0.94) !important;
            border-color: rgba(96,165,250,0.30) !important;
            box-shadow: inset 0 0 0 1px rgba(96,165,250,0.08) !important;
          }

          .dark-app .visual-timetable {
            background:
              linear-gradient(to bottom, rgba(96,165,250,0.22) 1px, transparent 1px),
              linear-gradient(to right, transparent 0 64px, rgba(96,165,250,0.26) 64px 65px, transparent 65px),
              linear-gradient(to right, transparent 0, transparent 20%, rgba(96,165,250,0.13) 20% calc(20% + 1px), transparent calc(20% + 1px)),
              linear-gradient(to right, transparent 0, transparent 40%, rgba(96,165,250,0.13) 40% calc(40% + 1px), transparent calc(40% + 1px)),
              linear-gradient(to right, transparent 0, transparent 60%, rgba(96,165,250,0.13) 60% calc(60% + 1px), transparent calc(60% + 1px)),
              linear-gradient(to right, transparent 0, transparent 80%, rgba(96,165,250,0.13) 80% calc(80% + 1px), transparent calc(80% + 1px)),
              linear-gradient(135deg, rgba(15,23,42,0.94), rgba(17,24,39,0.96)) !important;
            background-size:
              100% var(--tt-row-height),
              100% 100%,
              100% 100%,
              100% 100%,
              100% 100%,
              100% 100%,
              100% 100% !important;
          }

          .dark-app .visual-timetable-labels {
            background: rgba(15,23,42,0.88) !important;
            border-color: rgba(96,165,250,0.28) !important;
          }

          .dark-app .visual-timetable-hour {
            border-color: rgba(96,165,250,0.22) !important;
            color: #cbd5e1 !important;
          }

          .dark-app .visual-timetable-block {
            box-shadow: 0 10px 20px rgba(0,0,0,0.24);
          }

          /* 10-minute timetable patch: one hour row = 6 cells */
          .visual-timetable.ten-minute-table {
            min-width: 310px;
            background:
              linear-gradient(to bottom, var(--border) 1px, transparent 1px),
              linear-gradient(to right, transparent 0 var(--tt-label-width), var(--border) var(--tt-label-width) calc(var(--tt-label-width) + 1px), transparent calc(var(--tt-label-width) + 1px)),
              repeating-linear-gradient(
                to right,
                transparent 0,
                transparent calc((100% - var(--tt-label-width)) / 6 - 1px),
                rgba(148,163,184,0.28) calc((100% - var(--tt-label-width)) / 6 - 1px),
                rgba(148,163,184,0.28) calc((100% - var(--tt-label-width)) / 6)
              ) !important;
            background-size:
              100% var(--tt-row-height),
              100% 100%,
              calc(100% - var(--tt-label-width)) 100% !important;
            background-position:
              0 0,
              0 0,
              var(--tt-label-width) 0 !important;
          }

          .visual-timetable.ten-minute-table .visual-timetable-labels {
            width: var(--tt-label-width) !important;
          }

          .visual-timetable.ten-minute-table .visual-timetable-block {
            justify-content: center;
            min-width: 0;
          }

          .visual-timetable.ten-minute-table .ten-minute-block {
            border-radius: 999px;
          }

          .dark-app .visual-timetable.ten-minute-table {
            background:
              linear-gradient(to bottom, rgba(96,165,250,0.24) 1px, transparent 1px),
              linear-gradient(to right, transparent 0 var(--tt-label-width), rgba(96,165,250,0.28) var(--tt-label-width) calc(var(--tt-label-width) + 1px), transparent calc(var(--tt-label-width) + 1px)),
              repeating-linear-gradient(
                to right,
                transparent 0,
                transparent calc((100% - var(--tt-label-width)) / 6 - 1px),
                rgba(96,165,250,0.16) calc((100% - var(--tt-label-width)) / 6 - 1px),
                rgba(96,165,250,0.16) calc((100% - var(--tt-label-width)) / 6)
              ),
              linear-gradient(135deg, rgba(15,23,42,0.94), rgba(17,24,39,0.96)) !important;
            background-size:
              100% var(--tt-row-height),
              100% 100%,
              calc(100% - var(--tt-label-width)) 100%,
              100% 100% !important;
            background-position:
              0 0,
              0 0,
              var(--tt-label-width) 0,
              0 0 !important;
          }

          /* Final 10-minute highlighter timetable: one row = 6 cells, one cell = 10 minutes */
          .visual-timetable.ten-minute-table {
            min-width: 300px;
            background:
              linear-gradient(to bottom, var(--border) 1px, transparent 1px),
              linear-gradient(to right, transparent 0 var(--tt-label-width), var(--border) var(--tt-label-width) calc(var(--tt-label-width) + 1px), transparent calc(var(--tt-label-width) + 1px)),
              repeating-linear-gradient(
                to right,
                transparent 0,
                transparent calc((100% - var(--tt-label-width)) / 6 - 1px),
                rgba(148,163,184,0.30) calc((100% - var(--tt-label-width)) / 6 - 1px),
                rgba(148,163,184,0.30) calc((100% - var(--tt-label-width)) / 6)
              ) !important;
            background-size:
              100% var(--tt-row-height),
              100% 100%,
              calc(100% - var(--tt-label-width)) 100% !important;
            background-position:
              0 0,
              0 0,
              var(--tt-label-width) 0 !important;
          }

          .visual-timetable.ten-minute-table .visual-timetable-labels {
            width: var(--tt-label-width) !important;
          }

          .visual-timetable.ten-minute-table .visual-timetable-block {
            min-width: 0 !important;
            padding: 0 !important;
            border-radius: 999px !important;
            border-width: 0 !important;
            opacity: 0.72;
            box-shadow: none !important;
            backdrop-filter: blur(2px);
            pointer-events: auto;
          }

          .visual-timetable.ten-minute-table .visual-timetable-block::before {
            content: "";
            position: absolute;
            inset: 2px 0;
            border-radius: inherit;
            background: inherit;
            filter: blur(0.2px);
          }

          .visual-timetable.ten-minute-table .visual-timetable-block span {
            display: none !important;
          }

          .dark-app .visual-timetable.ten-minute-table {
            background:
              linear-gradient(to bottom, rgba(96,165,250,0.24) 1px, transparent 1px),
              linear-gradient(to right, transparent 0 var(--tt-label-width), rgba(96,165,250,0.28) var(--tt-label-width) calc(var(--tt-label-width) + 1px), transparent calc(var(--tt-label-width) + 1px)),
              repeating-linear-gradient(
                to right,
                transparent 0,
                transparent calc((100% - var(--tt-label-width)) / 6 - 1px),
                rgba(96,165,250,0.16) calc((100% - var(--tt-label-width)) / 6 - 1px),
                rgba(96,165,250,0.16) calc((100% - var(--tt-label-width)) / 6)
              ),
              linear-gradient(135deg, rgba(15,23,42,0.94), rgba(17,24,39,0.96)) !important;
            background-size:
              100% var(--tt-row-height),
              100% 100%,
              calc(100% - var(--tt-label-width)) 100%,
              100% 100% !important;
            background-position:
              0 0,
              0 0,
              var(--tt-label-width) 0,
              0 0 !important;
          }

          /* Cell-sized highlighter fix: each row has exactly 6 cells, blocks wrap by hour row */
          .visual-timetable.ten-minute-table {
            min-width: 300px;
            background:
              linear-gradient(to bottom, var(--border) 1px, transparent 1px),
              linear-gradient(to right, transparent 0 var(--tt-label-width), var(--border) var(--tt-label-width) calc(var(--tt-label-width) + 1px), transparent calc(var(--tt-label-width) + 1px)),
              repeating-linear-gradient(
                to right,
                transparent 0,
                transparent calc((100% - var(--tt-label-width)) / 6 - 1px),
                rgba(148,163,184,0.30) calc((100% - var(--tt-label-width)) / 6 - 1px),
                rgba(148,163,184,0.30) calc((100% - var(--tt-label-width)) / 6)
              ) !important;
            background-size:
              100% var(--tt-row-height),
              100% 100%,
              calc(100% - var(--tt-label-width)) 100% !important;
            background-position:
              0 0,
              0 0,
              var(--tt-label-width) 0 !important;
          }

          .visual-timetable.ten-minute-table .visual-timetable-block {
            min-width: 0 !important;
            max-width: none !important;
            padding: 0 !important;
            border-width: 0 !important;
            border-radius: 999px !important;
            opacity: 0.72;
            box-shadow: none !important;
            overflow: hidden;
            pointer-events: auto;
          }

          .visual-timetable.ten-minute-table .visual-timetable-block span {
            display: none !important;
          }

          .visual-timetable.ten-minute-table .visual-timetable-block::after {
            content: "";
            position: absolute;
            inset: 2px 0;
            border-radius: inherit;
            background: inherit;
            opacity: 0.84;
            filter: blur(0.15px);
          }

          .dark-app .visual-timetable.ten-minute-table {
            background:
              linear-gradient(to bottom, rgba(96,165,250,0.24) 1px, transparent 1px),
              linear-gradient(to right, transparent 0 var(--tt-label-width), rgba(96,165,250,0.28) var(--tt-label-width) calc(var(--tt-label-width) + 1px), transparent calc(var(--tt-label-width) + 1px)),
              repeating-linear-gradient(
                to right,
                transparent 0,
                transparent calc((100% - var(--tt-label-width)) / 6 - 1px),
                rgba(96,165,250,0.16) calc((100% - var(--tt-label-width)) / 6 - 1px),
                rgba(96,165,250,0.16) calc((100% - var(--tt-label-width)) / 6)
              ),
              linear-gradient(135deg, rgba(15,23,42,0.94), rgba(17,24,39,0.96)) !important;
            background-size:
              100% var(--tt-row-height),
              100% 100%,
              calc(100% - var(--tt-label-width)) 100%,
              100% 100% !important;
            background-position:
              0 0,
              0 0,
              var(--tt-label-width) 0,
              0 0 !important;
          }

          /* Final fix: 시간 표시는 칸으로 세지 않게 분리하고, 실제 칸은 가로 6칸만 보이게 함 */
          .visual-timetable.ten-minute-table {
            min-width: 300px;
            background:
              linear-gradient(to bottom, var(--border) 1px, transparent 1px),
              repeating-linear-gradient(
                to right,
                transparent 0,
                transparent calc((100% - var(--tt-label-width)) / 6 - 1px),
                rgba(148,163,184,0.34) calc((100% - var(--tt-label-width)) / 6 - 1px),
                rgba(148,163,184,0.34) calc((100% - var(--tt-label-width)) / 6)
              ) !important;
            background-size:
              calc(100% - var(--tt-label-width)) var(--tt-row-height),
              calc(100% - var(--tt-label-width)) 100% !important;
            background-position:
              var(--tt-label-width) 0,
              var(--tt-label-width) 0 !important;
            background-repeat: repeat, repeat !important;
          }

          .visual-timetable.ten-minute-table .visual-timetable-labels {
            background: transparent !important;
            border-right: 0 !important;
            box-shadow: none !important;
          }

          .visual-timetable.ten-minute-table .visual-timetable-hour {
            border-bottom: 0 !important;
            justify-content: flex-end;
            padding-right: 10px;
            box-sizing: border-box;
          }

          .visual-timetable.ten-minute-table .visual-timetable-block {
            min-width: 0 !important;
            padding: 0 !important;
            border-width: 0 !important;
            border-radius: 999px !important;
            opacity: 0.72;
            box-shadow: none !important;
            overflow: hidden;
          }

          .visual-timetable.ten-minute-table .visual-timetable-block span {
            display: none !important;
          }

          .dark-app .visual-timetable.ten-minute-table {
            background:
              linear-gradient(to bottom, rgba(96,165,250,0.24) 1px, transparent 1px),
              repeating-linear-gradient(
                to right,
                transparent 0,
                transparent calc((100% - var(--tt-label-width)) / 6 - 1px),
                rgba(96,165,250,0.17) calc((100% - var(--tt-label-width)) / 6 - 1px),
                rgba(96,165,250,0.17) calc((100% - var(--tt-label-width)) / 6)
              ),
              linear-gradient(135deg, rgba(15,23,42,0.94), rgba(17,24,39,0.96)) !important;
            background-size:
              calc(100% - var(--tt-label-width)) var(--tt-row-height),
              calc(100% - var(--tt-label-width)) 100%,
              100% 100% !important;
            background-position:
              var(--tt-label-width) 0,
              var(--tt-label-width) 0,
              0 0 !important;
            background-repeat: repeat, repeat, no-repeat !important;
          }

          /* Absolute final timetable: real DOM grid = label + exactly six 10-minute cells */
          .cell-timetable-wrap {
            margin-top: 10px;
            overflow: auto;
            border: 1px solid var(--border);
            border-radius: 18px;
            background: var(--card-bg-solid);
          }

          .cell-timetable {
            min-width: 300px;
            display: grid;
            grid-template-rows: repeat(24, var(--tt-row-height));
            background: var(--card-bg-solid);
          }

          .cell-timetable-row {
            display: grid;
            grid-template-columns: var(--tt-label-width) repeat(6, minmax(0, 1fr));
            border-bottom: 1px solid var(--border);
          }

          .cell-timetable-row:last-child {
            border-bottom: 0;
          }

          .cell-timetable-hour {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 10px;
            box-sizing: border-box;
            color: var(--text-mid);
            font-size: 12px;
            font-weight: 850;
            background: transparent;
          }

          .cell-timetable-cell {
            position: relative;
            min-width: 0;
            border-left: 1px solid rgba(148,163,184,0.32);
            background: transparent;
            overflow: hidden;
          }

          .cell-timetable-fill {
            position: absolute;
            top: 50%;
            height: 14px;
            transform: translateY(-50%);
            border-radius: 999px;
            border: 0;
            opacity: 0.72;
            box-shadow: none;
            filter: saturate(1.15);
          }

          .cell-timetable-fill::after {
            content: "";
            position: absolute;
            inset: 2px 0;
            border-radius: inherit;
            background: inherit;
            opacity: 0.75;
            filter: blur(0.2px);
          }

          /* 기존 absolute timetable CSS가 남아 있어도 이 새 격자에는 영향을 주지 않게 차단 */
          .cell-timetable .visual-timetable-block,
          .cell-timetable .ten-minute-block {
            display: none !important;
          }

          .dark-app .cell-timetable-wrap {
            background: rgba(15,23,42,0.94) !important;
            border-color: rgba(96,165,250,0.30) !important;
          }

          .dark-app .cell-timetable {
            background: linear-gradient(135deg, rgba(15,23,42,0.94), rgba(17,24,39,0.96)) !important;
          }

          .dark-app .cell-timetable-row {
            border-bottom-color: rgba(96,165,250,0.24) !important;
          }

          .dark-app .cell-timetable-cell {
            border-left-color: rgba(96,165,250,0.18) !important;
          }

          .dark-app .cell-timetable-hour {
            color: #cbd5e1 !important;
          }

          /* Empty timetable cells must stay unfilled. Only actual study/meal <i> bars get color. */
          .cell-timetable-cell {
            background: transparent !important;
          }

          .cell-timetable-fill {
            display: block !important;
          }

          .cell-timetable-cell:empty::before {
            content: none !important;
            display: none !important;
          }

          /* Fill each 10-minute cell vertically */
          .cell-timetable-fill {
            top: 0 !important;
            bottom: 0 !important;
            height: 100% !important;
            transform: none !important;
            border-radius: 0 !important;
            opacity: 0.68;
          }

          .cell-timetable-fill::after {
            inset: 0 !important;
            border-radius: 0 !important;
          }

          .cell-timetable-cell {
            overflow: hidden;
          }

          .task-color-picker {
            display: flex;
            gap: 5px;
            align-items: center;
            margin-top: 6px;
            flex-wrap: wrap;
          }

          .task-color-dot {
            appearance: none;
            border: 2px solid transparent;
            border-radius: 999px;
            padding: 0;
            cursor: pointer;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.38);
            transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
          }

          .task-color-dot:hover {
            transform: translateY(-1px) scale(1.06);
          }

          .task-color-dot.selected {
            box-shadow:
              0 0 0 2px rgba(37,99,235,0.18),
              inset 0 0 0 1px rgba(255,255,255,0.55);
            transform: scale(1.08);
          }

          .dark-app .task-color-dot.selected {
            box-shadow:
              0 0 0 2px rgba(147,197,253,0.20),
              0 0 12px rgba(96,165,250,0.16),
              inset 0 0 0 1px rgba(255,255,255,0.22);
          }

          /* More color choices + hide/show palette */
          .task-color-picker {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 6px;
            flex-wrap: wrap;
          }

          .task-color-toggle {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            border: 1px solid var(--border);
            border-radius: 999px;
            background: var(--input-bg);
            color: var(--text-main);
            font-size: 10px;
            font-weight: 900;
            padding: 4px 7px;
            cursor: pointer;
          }

          .task-color-toggle i {
            width: 12px;
            height: 12px;
            border: 1px solid;
            border-radius: 999px;
            display: block;
          }

          .task-color-palette {
            display: flex;
            gap: 5px;
            align-items: center;
            flex-wrap: wrap;
          }

          .dark-app .task-color-toggle {
            background: rgba(30,41,59,0.92) !important;
            color: #dbeafe !important;
            border-color: rgba(96,165,250,0.30) !important;
          }

          /* Dark mode uses the newly provided world map image */
          .dark-app .flight-map,
          .dark-app .flight-dashboard-card .flight-map {
            background:
              linear-gradient(rgba(2,6,23,0.08), rgba(2,6,23,0.10)),
              url("/images/blue-world-map-dark.jpg") !important;
            background-size: cover !important;
            background-position: center !important;
            background-color: #020617 !important;
          }

          .dark-app .flight-map-grid {
            background:
              radial-gradient(circle at 50% 50%, rgba(56,189,248,0.10), transparent 42%),
              linear-gradient(rgba(56,189,248,0.04), rgba(37,99,235,0.06)) !important;
          }

          .dark-app .flight-country {
            background: rgba(2,6,23,0.78) !important;
            color: #bae6fd !important;
            border-color: rgba(56,189,248,0.64) !important;
            box-shadow: 0 0 0 1px rgba(56,189,248,0.12), 0 0 14px rgba(56,189,248,0.20) !important;
          }

          .dark-app .flight-country.selected {
            background: linear-gradient(135deg, #0ea5e9, #2563eb) !important;
            color: #ffffff !important;
            border-color: rgba(186,230,253,0.86) !important;
            box-shadow: 0 0 20px rgba(56,189,248,0.42), 0 10px 24px rgba(37,99,235,0.38) !important;
          }

          .dark-app .flight-dashboard-card.tracking-flight .flight-country.selected::after,
          .dark-app .flight-country.selected::after {
            background: rgba(2,6,23,0.88) !important;
            color: #e0f2fe !important;
            border: 1px solid rgba(56,189,248,0.60) !important;
            box-shadow: 0 0 16px rgba(56,189,248,0.24) !important;
            text-shadow: none !important;
          }

          .dark-app .flight-route-line {
            stroke: #38bdf8 !important;
            filter:
              drop-shadow(0 0 8px rgba(56,189,248,0.90))
              drop-shadow(0 8px 10px rgba(14,165,233,0.24)) !important;
          }

          .flight-mileage-panel {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 180px)) minmax(0, 1fr);
            gap: 10px;
            margin: 12px 0;
          }

          .flight-mileage-card,
          .flight-passport-book,
          .easy-flight-mileage-mini {
            border: 1px solid var(--border);
            border-radius: 20px;
            background: var(--card-bg-solid);
            padding: 12px;
            box-shadow: 0 10px 26px rgba(15,23,42,0.06);
          }

          .flight-mileage-card span,
          .flight-passport-book span,
          .easy-flight-mileage-mini span {
            display: block;
            color: var(--text-sub);
            font-size: 11px;
            font-weight: 900;
          }

          .flight-mileage-card b {
            display: block;
            font-size: 22px;
            margin: 4px 0;
          }

          .flight-mileage-card small {
            color: var(--text-sub);
            font-size: 11px;
          }

          .flight-unlock-strip {
            display: flex;
            gap: 7px;
            overflow-x: auto;
            align-items: stretch;
            padding: 2px;
          }

          .flight-unlock-strip button {
            min-width: 70px;
            border: 1px solid var(--border);
            border-radius: 16px;
            background: var(--input-bg);
            color: var(--text-main);
            font-weight: 900;
            cursor: pointer;
            padding: 8px;
          }

          .flight-unlock-strip button:disabled {
            opacity: 0.55;
            cursor: not-allowed;
          }

          .flight-unlock-strip button b,
          .flight-unlock-strip button span {
            display: block;
          }

          .flight-passport-book {
            margin-bottom: 12px;
          }

          .passport-stamp-list {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            margin-top: 10px;
          }

          .passport-stamp-list span {
            min-width: 86px;
            border: 1px dashed var(--accent);
            border-radius: 16px;
            padding: 8px;
            color: var(--accent-text);
            background: var(--accent-soft);
            font-weight: 950;
            text-align: center;
          }

          .passport-stamp-list small {
            display: block;
            color: var(--text-sub);
            margin-top: 3px;
          }

          .flight-country.locked {
            opacity: 0.58;
            filter: grayscale(0.15);
            border-style: dashed !important;
          }

          .flight-country.locked::after {
            background: rgba(15,23,42,0.78) !important;
            color: #fff !important;
          }

          .easy-flight-mileage-mini {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 10px;
          }

          .easy-flight-mileage-mini b {
            font-size: 18px;
          }

          .arrival-reward-overlay {
            position: fixed;
            inset: 0;
            z-index: 150;
            background: rgba(2,6,23,0.58);
            display: grid;
            place-items: center;
            padding: 18px;
            backdrop-filter: blur(8px);
          }

          .arrival-reward-card {
            width: min(520px, 100%);
            position: relative;
            border-radius: 30px;
            padding: 24px;
            background:
              radial-gradient(circle at 12% 0%, rgba(56,189,248,0.18), transparent 34%),
              linear-gradient(135deg, var(--card-bg-solid), var(--soft-bg));
            border: 1px solid var(--border);
            box-shadow: 0 28px 80px rgba(0,0,0,0.28);
          }

          .arrival-close {
            position: absolute;
            right: 14px;
            top: 12px;
            width: 34px;
            height: 34px;
            border: 1px solid var(--border);
            border-radius: 999px;
            background: var(--input-bg);
            color: var(--text-main);
            font-size: 20px;
            cursor: pointer;
          }

          .arrival-kicker {
            color: var(--accent);
            font-size: 12px;
            letter-spacing: 2px;
            font-weight: 950;
          }

          .arrival-reward-card h2 {
            margin: 8px 0 6px;
            font-size: 28px;
          }

          .arrival-reward-card p {
            color: var(--text-sub);
            line-height: 1.5;
          }

          .arrival-stamp {
            margin: 16px 0;
            border: 2px dashed var(--accent);
            border-radius: 24px;
            padding: 18px;
            text-align: center;
            background: var(--accent-soft);
            transform: rotate(-1.5deg);
          }

          .arrival-stamp span,
          .arrival-stamp small {
            display: block;
            color: var(--text-sub);
            font-size: 11px;
            font-weight: 900;
          }

          .arrival-stamp b {
            display: block;
            font-size: 28px;
            margin: 5px 0;
            color: var(--accent-text);
          }

          .arrival-reward-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .arrival-reward-grid div {
            background: var(--input-bg);
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 12px;
          }

          .arrival-reward-grid span {
            display: block;
            color: var(--text-sub);
            font-size: 11px;
            font-weight: 900;
          }

          .arrival-reward-grid b {
            display: block;
            margin-top: 4px;
            font-size: 18px;
          }

          .dark-app .flight-mileage-card,
          .dark-app .flight-passport-book,
          .dark-app .easy-flight-mileage-mini,
          .dark-app .arrival-reward-card {
            background: rgba(15,23,42,0.94) !important;
            border-color: rgba(96,165,250,0.30) !important;
            color: var(--text-main) !important;
          }

          .dark-app .flight-unlock-strip button {
            background: rgba(30,41,59,0.92) !important;
            color: #dbeafe !important;
            border-color: rgba(96,165,250,0.30) !important;
          }

          .dark-app .passport-stamp-list span,
          .dark-app .arrival-stamp {
            background: rgba(37,99,235,0.18) !important;
            border-color: rgba(56,189,248,0.60) !important;
            color: #dbeafe !important;
          }

          .dark-app .arrival-reward-grid div,
          .dark-app .arrival-close {
            background: rgba(30,41,59,0.92) !important;
            border-color: rgba(96,165,250,0.30) !important;
            color: #e5e7eb !important;
          }

          .passport-open-button,
          .easy-flight-mileage-mini button {
            margin-top: 8px;
            border: 1px solid var(--border);
            border-radius: 999px;
            background: var(--input-bg);
            color: var(--text-main);
            padding: 6px 10px;
            font-weight: 900;
            cursor: pointer;
          }

          .passport-stat-list {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            margin-top: 10px;
            padding-bottom: 2px;
          }

          .passport-stat-list span {
            min-width: 92px;
            border: 1px solid var(--border);
            border-radius: 16px;
            background: var(--input-bg);
            padding: 8px;
            color: var(--text-main);
            font-size: 11px;
            font-weight: 850;
          }

          .passport-stat-list b,
          .passport-stat-list small {
            display: block;
          }

          .passport-stat-list small {
            color: var(--accent);
            margin-top: 3px;
            font-weight: 950;
          }

          .passport-page-overlay {
            position: fixed;
            inset: 0;
            z-index: 155;
            background: rgba(2,6,23,0.62);
            display: grid;
            place-items: center;
            padding: 18px;
            backdrop-filter: blur(8px);
          }

          .passport-page-shell {
            width: min(980px, 100%);
            max-height: calc(100dvh - 36px);
            overflow: hidden;
            border-radius: 32px;
            background:
              radial-gradient(circle at 10% 0%, rgba(37,99,235,0.16), transparent 32%),
              var(--card-bg-solid);
            border: 1px solid var(--border);
            box-shadow: 0 30px 90px rgba(0,0,0,0.30);
            padding: 18px;
          }

          .passport-page-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 14px;
          }

          .passport-page-top span {
            color: var(--accent);
            letter-spacing: 2px;
            font-size: 11px;
            font-weight: 950;
          }

          .passport-page-top h2 {
            margin: 4px 0 0;
          }

          .passport-page-top button {
            width: 38px;
            height: 38px;
            border: 1px solid var(--border);
            border-radius: 999px;
            background: var(--input-bg);
            color: var(--text-main);
            font-size: 22px;
            cursor: pointer;
          }

          .passport-book-layout {
            display: grid;
            grid-template-columns: 48px 1fr 48px;
            gap: 12px;
            align-items: stretch;
          }

          .passport-page-nav {
            border: 1px solid var(--border);
            border-radius: 24px;
            background: var(--input-bg);
            color: var(--text-main);
            font-size: 34px;
            cursor: pointer;
          }

          .passport-page-nav:disabled {
            opacity: 0.35;
            cursor: not-allowed;
          }

          .passport-paper-page {
            min-height: 520px;
            border-radius: 28px;
            padding: 24px;
            background:
              linear-gradient(90deg, rgba(15,23,42,0.05), transparent 12%, transparent 88%, rgba(15,23,42,0.05)),
              #fffaf0;
            border: 1px solid rgba(180,148,92,0.38);
            box-shadow:
              inset 20px 0 30px rgba(120,80,30,0.06),
              inset -20px 0 30px rgba(120,80,30,0.04),
              0 18px 44px rgba(15,23,42,0.16);
            animation: passportPageFlip 360ms cubic-bezier(0.16, 1, 0.3, 1);
            color: #1f2937;
          }

          @keyframes passportPageFlip {
            from { transform: rotateY(-8deg) translateX(8px); opacity: 0.35; }
            to { transform: rotateY(0) translateX(0); opacity: 1; }
          }

          .passport-cover-page {
            min-height: 470px;
            display: grid;
            place-items: center;
            text-align: center;
            align-content: center;
            gap: 12px;
          }

          .passport-emblem {
            width: 104px;
            height: 104px;
            border-radius: 30px;
            display: grid;
            place-items: center;
            background: #0f172a;
            color: #dbeafe;
            font-weight: 950;
            letter-spacing: -2px;
            box-shadow: 0 16px 34px rgba(15,23,42,0.22);
          }

          .passport-cover-page h3 {
            font-size: 30px;
            margin: 0;
          }

          .passport-cover-page p {
            max-width: 420px;
            margin: 0 auto;
            color: #64748b;
          }

          .passport-cover-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            width: min(520px, 100%);
            margin-top: 12px;
          }

          .passport-cover-stats div,
          .passport-page-stamp {
            border: 1px solid rgba(180,148,92,0.34);
            border-radius: 22px;
            background: rgba(255,255,255,0.46);
            padding: 14px;
          }

          .passport-cover-stats span {
            display: block;
            color: #64748b;
            font-size: 11px;
            font-weight: 900;
          }

          .passport-cover-stats b {
            display: block;
            margin-top: 5px;
            font-size: 22px;
          }

          .passport-page-label {
            color: #64748b;
            font-size: 11px;
            font-weight: 950;
            letter-spacing: 2px;
            margin-bottom: 12px;
          }

          .passport-page-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .passport-page-stamp {
            min-height: 118px;
            display: grid;
            place-items: center;
            text-align: center;
            border: 2px dashed rgba(37,99,235,0.44);
            color: #1e3a8a;
            transform: rotate(-1deg);
          }

          .passport-page-stamp:nth-child(even) {
            transform: rotate(1.2deg);
            color: #7f1d1d;
            border-color: rgba(220,38,38,0.38);
          }

          .passport-page-stamp span,
          .passport-page-stamp small {
            display: block;
            color: #64748b;
            font-size: 11px;
            font-weight: 900;
          }

          .passport-page-stamp b {
            font-size: 22px;
          }

          .passport-empty-page {
            color: #64748b;
          }

          .passport-country-stats {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 16px;
          }

          .passport-country-stats span {
            border-radius: 999px;
            background: rgba(15,23,42,0.06);
            padding: 6px 10px;
            font-size: 11px;
            font-weight: 850;
          }

          .dev-flight-tools {
            display: grid;
            gap: 8px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid rgba(148,163,184,0.24);
          }

          .dev-flight-tools label {
            display: grid;
            gap: 4px;
            font-size: 11px;
            color: var(--text-sub);
            font-weight: 900;
          }

          .dev-flight-tools input,
          .dev-flight-tools select {
            border: 1px solid var(--border);
            border-radius: 12px;
            background: var(--input-bg);
            color: var(--text-main);
            padding: 8px;
          }

          .dev-stamp-row {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 6px;
            align-items: center;
          }

          .dark-app .passport-page-shell,
          .dark-app .passport-page-top button,
          .dark-app .passport-page-nav,
          .dark-app .passport-open-button,
          .dark-app .easy-flight-mileage-mini button,
          .dark-app .passport-stat-list span {
            background: rgba(15,23,42,0.94) !important;
            color: var(--text-main) !important;
            border-color: rgba(96,165,250,0.30) !important;
          }

          .dark-app .passport-paper-page {
            background:
              linear-gradient(90deg, rgba(96,165,250,0.09), transparent 12%, transparent 88%, rgba(96,165,250,0.08)),
              #111827 !important;
            color: #e5e7eb !important;
            border-color: rgba(96,165,250,0.30) !important;
          }

          .dark-app .passport-cover-page p,
          .dark-app .passport-cover-stats span,
          .dark-app .passport-page-label,
          .dark-app .passport-page-stamp span,
          .dark-app .passport-page-stamp small,
          .dark-app .passport-empty-page {
            color: #94a3b8 !important;
          }

          .dark-app .passport-cover-stats div,
          .dark-app .passport-page-stamp {
            background: rgba(30,41,59,0.78) !important;
            border-color: rgba(96,165,250,0.30) !important;
            color: #dbeafe !important;
          }

          .dark-app .passport-page-stamp:nth-child(even) {
            color: #fecaca !important;
            border-color: rgba(248,113,113,0.36) !important;
          }

          .dark-app .passport-country-stats span {
            background: rgba(96,165,250,0.14) !important;
            color: #dbeafe !important;
          }

          .top-mode-controls {
            display: flex;
            gap: 4px;
            padding: 4px;
            border-radius: 999px;
            background: var(--input-bg);
            border: 1px solid var(--border-soft);
            flex: 0 0 auto;
            align-items: center;
            box-shadow: var(--accent-shadow) 0 8px 20px -18px;
          }

          .top-mode-button,
          .top-appearance-button {
            border: none;
            height: 30px;
            padding: 0 10px;
            border-radius: 999px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 950;
            background: transparent;
            color: var(--text-main);
            transition: background 260ms ease, color 220ms ease, box-shadow 260ms ease, transform 200ms ease;
          }

          .top-appearance-button {
            background: var(--card-bg-solid);
            border: 1px solid var(--border);
            color: var(--text-mid);
          }

          .top-mode-button.active {
            background: var(--accent);
            color: white;
            box-shadow: 0 8px 18px var(--accent-shadow);
          }

          .top-mode-button.flight.active {
            background: linear-gradient(135deg, #2563eb, #0ea5e9);
            color: white;
            box-shadow: 0 8px 18px rgba(37,99,235,0.24);
          }

          .top-mode-button:hover,
          .top-appearance-button:hover {
            transform: translateY(-1px);
          }

          .flight-unlock-box {
            min-width: 0;
            display: grid;
            gap: 8px;
          }

          .flight-unlock-box-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
          }

          .flight-unlock-box-head span {
            color: var(--text-sub);
            font-size: 11px;
            font-weight: 950;
          }

          .flight-unlock-box-head button {
            border: 1px solid var(--border);
            border-radius: 999px;
            background: var(--input-bg);
            color: var(--text-main);
            padding: 6px 9px;
            font-size: 11px;
            font-weight: 950;
            cursor: pointer;
          }

          .all-unlocked-message {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 120px;
            color: var(--text-sub);
            font-size: 12px;
            font-weight: 900;
          }

          .unlock-list-overlay {
            position: fixed;
            inset: 0;
            z-index: 156;
            background: rgba(2,6,23,0.62);
            display: grid;
            place-items: center;
            padding: 18px;
            backdrop-filter: blur(8px);
          }

          .unlock-list-modal {
            width: min(860px, 100%);
            max-height: calc(100dvh - 36px);
            overflow: hidden;
            border-radius: 30px;
            background: var(--card-bg-solid);
            border: 1px solid var(--border);
            box-shadow: 0 30px 90px rgba(0,0,0,0.30);
            padding: 18px;
            display: grid;
            gap: 14px;
          }

          .unlock-list-head {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: flex-start;
          }

          .unlock-list-head span {
            color: var(--accent);
            font-size: 11px;
            font-weight: 950;
            letter-spacing: 2px;
          }

          .unlock-list-head h2 {
            margin: 4px 0 4px;
          }

          .unlock-list-head p {
            margin: 0;
            color: var(--text-sub);
            font-size: 13px;
          }

          .unlock-list-head button {
            width: 38px;
            height: 38px;
            border: 1px solid var(--border);
            border-radius: 999px;
            background: var(--input-bg);
            color: var(--text-main);
            font-size: 22px;
            cursor: pointer;
          }

          .unlock-list-grid {
            overflow: auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
            gap: 10px;
            padding-right: 4px;
          }

          .unlock-country-card,
          .unlock-empty-card {
            border: 1px solid var(--border);
            border-radius: 20px;
            background: var(--input-bg);
            padding: 12px;
            display: grid;
            gap: 8px;
          }

          .unlock-country-card b {
            display: block;
            font-size: 20px;
          }

          .unlock-country-card span,
          .unlock-country-card small {
            display: block;
            color: var(--text-sub);
            font-size: 12px;
            font-weight: 850;
          }

          .unlock-country-card strong {
            color: var(--accent);
            font-size: 18px;
          }

          .unlock-country-card button {
            border: 0;
            border-radius: 14px;
            padding: 9px 10px;
            background: linear-gradient(135deg, #2563eb, #0ea5e9);
            color: white;
            font-weight: 950;
            cursor: pointer;
          }

          .unlock-country-card button:disabled {
            background: var(--soft-bg-2);
            color: var(--text-sub);
            cursor: not-allowed;
          }

          .dark-app .top-mode-controls,
          .dark-app .unlock-list-modal,
          .dark-app .unlock-country-card,
          .dark-app .unlock-empty-card,
          .dark-app .flight-unlock-box-head button {
            background: rgba(15,23,42,0.94) !important;
            border-color: rgba(96,165,250,0.30) !important;
            color: var(--text-main) !important;
          }

          .dark-app .top-appearance-button {
            background: rgba(30,41,59,0.92) !important;
            color: #dbeafe !important;
            border-color: rgba(96,165,250,0.30) !important;
          }

          /* Modal scroll lock: 자세히 보기 내부만 스크롤되고 홈 화면은 움직이지 않게 */
          .unlock-list-overlay,
          .passport-page-overlay,
          .arrival-reward-overlay {
            overscroll-behavior: none !important;
            touch-action: none;
          }

          .unlock-list-modal,
          .unlock-list-grid,
          .passport-page-shell {
            overscroll-behavior: contain !important;
            touch-action: pan-y;
          }

          .unlock-list-grid {
            max-height: min(62dvh, 560px);
            overflow-y: auto !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch;
          }

          .dev-flight-tools .dev-danger-button {
            background: #dc2626 !important;
            color: #ffffff !important;
          }

          .dev-flight-tools .dev-danger-button:disabled {
            background: #94a3b8 !important;
            cursor: not-allowed;
            opacity: 0.65;
          }

          .dark-app .dev-flight-tools .dev-danger-button {
            background: linear-gradient(135deg, #7f1d1d, #dc2626) !important;
            color: #fee2e2 !important;
            border: 1px solid rgba(248,113,113,0.35) !important;
          }

          .stdr-air-tier-card {
            background:
              radial-gradient(circle at 12% 0%, rgba(59,130,246,0.16), transparent 42%),
              linear-gradient(135deg, var(--card-bg-solid), var(--soft-bg)) !important;
          }

          .stdr-tier-progress {
            position: relative;
            height: 8px;
            border-radius: 999px;
            overflow: hidden;
            background: var(--soft-bg-2);
            border: 1px solid var(--border);
            margin-top: 9px;
          }

          .stdr-tier-progress i {
            display: block;
            height: 100%;
            border-radius: inherit;
            background: linear-gradient(90deg, #2563eb, #0ea5e9, #22c55e);
            transition: width 420ms cubic-bezier(0.16, 1, 0.3, 1);
          }

          .arrival-airline-tier {
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 14px;
            background: var(--input-bg);
            margin: 14px 0;
          }

          .arrival-airline-tier span,
          .arrival-airline-tier small {
            display: block;
            color: var(--text-sub);
            font-size: 11px;
            font-weight: 900;
          }

          .arrival-airline-tier b {
            display: block;
            margin: 5px 0;
            font-size: 26px;
            font-weight: 950;
            color: var(--accent-text);
          }

          .dark-app .stdr-air-tier-card,
          .dark-app .arrival-airline-tier {
            background: rgba(15,23,42,0.94) !important;
            border-color: rgba(96,165,250,0.30) !important;
            color: var(--text-main) !important;
          }

          /* STDR Air tier visual system */
          .flight-dashboard-card {
            border-color: color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 48%, rgba(147,197,253,0.65)) !important;
            box-shadow: 0 18px 42px color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 18%, transparent) !important;
          }

          .flight-dashboard-card .flight-kicker,
          .flight-mileage-card.stdr-air-tier-card span {
            color: var(--stdr-tier-accent, var(--flight-blue)) !important;
          }

          .flight-dashboard-card .flight-route-line {
            stroke: var(--stdr-tier-accent-2, #0ea5e9) !important;
            filter: drop-shadow(0 0 8px color-mix(in srgb, var(--stdr-tier-accent-2, #0ea5e9) 70%, transparent)) !important;
          }

          .flight-plane {
            color: var(--stdr-plane-color, #2563eb);
            text-shadow:
              0 0 12px color-mix(in srgb, var(--stdr-plane-color, #2563eb) 48%, transparent),
              0 8px 18px rgba(15,23,42,0.20);
          }

          .flight-ticket {
            background: var(--stdr-ticket-bg, linear-gradient(135deg, #eff6ff, #dbeafe)) !important;
            color: var(--stdr-ticket-text, #1e3a8a) !important;
            border-color: color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 34%, white) !important;
          }

          .flight-ticket-main span,
          .flight-ticket-main small,
          .flight-ticket-stub span,
          .flight-ticket-stub small {
            color: color-mix(in srgb, var(--stdr-ticket-text, #1e3a8a) 72%, #64748b) !important;
          }

          .flight-ticket-stub {
            border-left-color: color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 38%, transparent) !important;
          }

          .passport-paper-page {
            background: var(--stdr-passport-bg, linear-gradient(135deg, #fffaf0, #eff6ff)) !important;
            border-color: color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 32%, rgba(180,148,92,0.38)) !important;
          }

          .passport-emblem {
            background: linear-gradient(135deg, var(--stdr-tier-accent, #111827), var(--stdr-tier-accent-2, #2563eb)) !important;
            color: white !important;
          }

          .passport-page-stamp {
            border-color: color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 45%, rgba(37,99,235,0.34)) !important;
            color: var(--stdr-ticket-text, #1e3a8a) !important;
          }

          .arrival-reward-card {
            background:
              radial-gradient(circle at 12% 0%, color-mix(in srgb, var(--stdr-tier-accent-2, #0ea5e9) 20%, transparent), transparent 34%),
              var(--stdr-reward-bg, linear-gradient(135deg, var(--card-bg-solid), var(--soft-bg))) !important;
            border-color: color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 40%, var(--border)) !important;
          }

          .arrival-stamp,
          .arrival-airline-tier {
            border-color: color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 55%, var(--border)) !important;
          }

          .arrival-airline-tier b {
            color: var(--stdr-ticket-text, var(--accent-text)) !important;
          }

          .stdr-tier-preview-button {
            width: 100%;
            margin-top: 10px;
            border: 1px solid var(--border);
            border-radius: 999px;
            background: var(--input-bg);
            color: var(--text-main);
            padding: 8px 10px;
            font-weight: 950;
            cursor: pointer;
          }

          .tier-preview-overlay {
            position: fixed;
            inset: 0;
            z-index: 158;
            background: rgba(2,6,23,0.64);
            display: grid;
            place-items: center;
            padding: 18px;
            backdrop-filter: blur(8px);
            overscroll-behavior: none;
          }

          .tier-preview-modal {
            width: min(1120px, 100%);
            max-height: calc(100dvh - 36px);
            overflow: hidden;
            border-radius: 32px;
            background: var(--card-bg-solid);
            border: 1px solid var(--border);
            box-shadow: 0 30px 90px rgba(0,0,0,0.32);
            padding: 18px;
            display: grid;
            gap: 14px;
          }

          .tier-preview-head {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: flex-start;
          }

          .tier-preview-head span {
            color: var(--accent);
            font-size: 11px;
            font-weight: 950;
            letter-spacing: 2px;
          }

          .tier-preview-head h2 {
            margin: 5px 0;
          }

          .tier-preview-head p {
            margin: 0;
            color: var(--text-sub);
            font-size: 13px;
            line-height: 1.45;
          }

          .tier-preview-head button {
            width: 38px;
            height: 38px;
            border: 1px solid var(--border);
            border-radius: 999px;
            background: var(--input-bg);
            color: var(--text-main);
            font-size: 22px;
            cursor: pointer;
          }

          .tier-preview-grid {
            overflow: auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 12px;
            padding-right: 4px;
            max-height: min(70dvh, 680px);
            overscroll-behavior: contain;
          }

          .tier-preview-card {
            border: 1px solid color-mix(in srgb, var(--stdr-tier-accent) 36%, var(--border));
            border-radius: 26px;
            padding: 14px;
            background:
              radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--stdr-tier-accent-2) 16%, transparent), transparent 42%),
              var(--card-bg-solid);
            display: grid;
            gap: 12px;
            opacity: 0.74;
            position: relative;
            overflow: hidden;
          }

          .tier-preview-card.unlocked {
            opacity: 1;
            box-shadow: 0 16px 34px color-mix(in srgb, var(--stdr-tier-accent) 14%, transparent);
          }

          .tier-preview-title span {
            display: inline-flex;
            border-radius: 999px;
            padding: 4px 8px;
            background: color-mix(in srgb, var(--stdr-tier-accent) 14%, transparent);
            color: var(--stdr-tier-accent);
            font-size: 11px;
            font-weight: 950;
          }

          .tier-preview-title h3 {
            margin: 7px 0 2px;
            font-size: 24px;
          }

          .tier-preview-title small {
            color: var(--text-sub);
            font-weight: 850;
          }

          .tier-preview-ticket {
            min-height: 94px;
            border-radius: 22px;
            padding: 12px;
            display: grid;
            grid-template-columns: minmax(0, 1fr) 54px;
            gap: 10px;
            align-items: center;
            background: var(--stdr-ticket-bg);
            color: var(--stdr-ticket-text);
            border: 1px solid color-mix(in srgb, var(--stdr-tier-accent) 28%, white);
          }

          .tier-preview-ticket span,
          .tier-preview-ticket small,
          .tier-preview-passport span,
          .tier-preview-passport small,
          .tier-preview-plane small,
          .tier-preview-reward span,
          .tier-preview-reward small {
            display: block;
            font-size: 11px;
            font-weight: 900;
            opacity: 0.72;
          }

          .tier-preview-ticket b {
            display: block;
            font-size: 24px;
            margin: 4px 0;
          }

          .tier-preview-ticket i {
            width: 48px;
            height: 48px;
            border-radius: 16px;
            display: grid;
            place-items: center;
            font-style: normal;
            font-weight: 950;
            background: color-mix(in srgb, var(--stdr-tier-accent) 18%, rgba(255,255,255,0.56));
            border: 1px dashed color-mix(in srgb, var(--stdr-tier-accent) 42%, transparent);
          }

          .tier-preview-middle {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .tier-preview-passport,
          .tier-preview-plane,
          .tier-preview-reward {
            border-radius: 22px;
            padding: 12px;
            border: 1px solid color-mix(in srgb, var(--stdr-tier-accent) 28%, var(--border));
            background: var(--stdr-passport-bg);
            min-height: 96px;
            color: var(--stdr-ticket-text);
          }

          .tier-preview-passport b {
            display: block;
            font-size: 30px;
            margin: 6px 0;
          }

          .tier-preview-plane {
            display: grid;
            place-items: center;
            text-align: center;
          }

          .tier-preview-plane span {
            font-size: 42px;
            color: var(--stdr-plane-color);
            filter: drop-shadow(0 0 10px color-mix(in srgb, var(--stdr-plane-color) 40%, transparent));
          }

          .tier-preview-reward {
            background: var(--stdr-reward-bg);
            min-height: 82px;
          }

          .tier-preview-reward b {
            display: block;
            margin: 5px 0;
            color: var(--stdr-ticket-text);
          }

          .dark-app .tier-preview-modal,
          .dark-app .tier-preview-head button,
          .dark-app .stdr-tier-preview-button {
            background: rgba(15,23,42,0.94) !important;
            border-color: rgba(96,165,250,0.30) !important;
            color: var(--text-main) !important;
          }

          .dark-app .tier-preview-card {
            background:
              radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--stdr-tier-accent-2) 18%, transparent), transparent 42%),
              rgba(15,23,42,0.96) !important;
          }

          /* Fix tier preview clipping: make every preview card fully visible */
          .tier-preview-overlay {
            align-items: start !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch;
            padding: 18px !important;
          }

          .tier-preview-modal {
            max-height: none !important;
            height: auto !important;
            overflow: visible !important;
            margin: 0 auto 18px !important;
          }

          .tier-preview-grid {
            max-height: none !important;
            overflow: visible !important;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
            align-items: stretch !important;
          }

          .tier-preview-card {
            min-height: 500px;
            overflow: visible !important;
            align-content: start;
          }

          .tier-preview-ticket,
          .tier-preview-passport,
          .tier-preview-plane,
          .tier-preview-reward {
            overflow: visible !important;
          }

          @media (max-width: 760px) {
            .tier-preview-modal {
              border-radius: 24px !important;
              padding: 14px !important;
            }

            .tier-preview-grid {
              grid-template-columns: 1fr !important;
            }

            .tier-preview-card {
              min-height: auto;
            }

            .tier-preview-middle {
              grid-template-columns: 1fr !important;
            }
          }

          /* Show more locked destinations without opening detail modal */
          .flight-mileage-panel {
            grid-template-columns: minmax(170px, 0.7fr) minmax(190px, 0.85fr) minmax(190px, 0.85fr) minmax(420px, 1.8fr) !important;
            align-items: stretch !important;
          }

          .flight-unlock-box {
            min-width: 420px;
          }

          .flight-unlock-strip {
            display: grid !important;
            grid-auto-flow: column !important;
            grid-auto-columns: minmax(82px, 96px) !important;
            grid-template-rows: repeat(2, minmax(58px, auto)) !important;
            gap: 8px !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            padding: 2px 4px 8px 2px !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
          }

          .flight-unlock-strip button {
            min-width: 0 !important;
            width: 100% !important;
            min-height: 58px !important;
          }

          .flight-unlock-strip .all-unlocked-message {
            min-width: 180px;
            grid-row: 1 / span 2;
          }

          @media (max-width: 1240px) {
            .flight-mileage-panel {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }

            .flight-unlock-box {
              grid-column: 1 / -1;
              min-width: 0;
            }
          }

          @media (max-width: 720px) {
            .flight-mileage-panel {
              grid-template-columns: 1fr !important;
            }

            .flight-unlock-strip {
              grid-template-rows: repeat(2, minmax(54px, auto)) !important;
              grid-auto-columns: minmax(76px, 88px) !important;
            }
          }

          .stdr-theme-button {
            min-width: 96px;
            color: var(--accent-text) !important;
            background:
              linear-gradient(135deg, var(--accent-soft), var(--accent-soft-2)) !important;
            border-color: color-mix(in srgb, var(--accent) 34%, var(--border)) !important;
          }

          .stdr-theme-unlock-strip {
            display: flex;
            gap: 7px;
            flex-wrap: wrap;
            margin-top: 10px;
          }

          .stdr-theme-unlock-strip button {
            display: inline-grid;
            grid-template-columns: 13px auto;
            grid-template-rows: auto auto;
            column-gap: 6px;
            align-items: center;
            border: 1px solid color-mix(in srgb, var(--stdr-tier-accent) 36%, var(--border));
            border-radius: 999px;
            background: var(--input-bg);
            color: var(--text-main);
            padding: 6px 9px;
            font-size: 11px;
            font-weight: 950;
            cursor: pointer;
          }

          .stdr-theme-unlock-strip button:disabled {
            opacity: 0.42;
            cursor: not-allowed;
          }

          .stdr-theme-unlock-strip button.active {
            background:
              linear-gradient(135deg, color-mix(in srgb, var(--stdr-tier-accent) 16%, white), color-mix(in srgb, var(--stdr-tier-accent-2) 16%, white));
            box-shadow: 0 8px 20px color-mix(in srgb, var(--stdr-tier-accent) 18%, transparent);
          }

          .stdr-theme-unlock-strip i {
            grid-row: 1 / span 2;
            width: 13px;
            height: 13px;
            border-radius: 999px;
            background: linear-gradient(135deg, var(--stdr-tier-accent), var(--stdr-tier-accent-2));
          }

          .stdr-theme-unlock-strip span,
          .stdr-theme-unlock-strip small {
            line-height: 1.05;
          }

          .stdr-theme-unlock-strip small {
            opacity: 0.68;
            font-size: 10px;
          }

          .dark-app .stdr-theme-unlock-strip button.active {
            background:
              linear-gradient(135deg, color-mix(in srgb, var(--stdr-tier-accent) 22%, #0f172a), color-mix(in srgb, var(--stdr-tier-accent-2) 18%, #0f172a)) !important;
          }

          /* Stronger STDR Air tier differentiation + preview overlap fix */
          .tier-preview-overlay {
            align-items: start !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch;
          }

          .tier-preview-modal {
            overflow: visible !important;
            max-height: none !important;
          }

          .tier-preview-head {
            align-items: flex-start !important;
          }

          .tier-preview-head > div {
            min-width: 0;
          }

          .stdr-theme-unlock-strip {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(132px, 1fr)) !important;
            gap: 8px !important;
            width: 100%;
            max-width: 760px;
          }

          .stdr-theme-unlock-strip button {
            min-height: 50px !important;
            border-radius: 18px !important;
            padding: 8px 10px !important;
            overflow: hidden;
          }

          .stdr-theme-unlock-strip span,
          .stdr-theme-unlock-strip small {
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .tier-preview-grid {
            max-height: none !important;
            overflow: visible !important;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)) !important;
            align-items: stretch !important;
          }

          .tier-preview-card {
            min-height: 560px !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 14px !important;
            overflow: visible !important;
            border-width: 2px !important;
            background:
              radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--stdr-tier-accent-2) 22%, transparent), transparent 42%),
              linear-gradient(135deg, color-mix(in srgb, var(--stdr-tier-accent) 6%, var(--card-bg-solid)), var(--card-bg-solid)) !important;
          }

          .tier-preview-card.locked {
            filter: grayscale(0.18);
          }

          .tier-preview-title {
            min-height: 96px;
          }

          .tier-preview-title h3,
          .tier-preview-title small {
            display: block;
            overflow: visible;
          }

          .tier-preview-ticket {
            min-height: 122px !important;
            flex-shrink: 0;
            box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--stdr-tier-accent) 18%, rgba(255,255,255,0.35));
          }

          .tier-preview-ticket b {
            line-height: 1.05;
          }

          .tier-preview-middle {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
            flex-shrink: 0;
          }

          .tier-preview-passport,
          .tier-preview-plane {
            min-height: 132px !important;
            display: grid !important;
            align-content: center !important;
            justify-items: center !important;
            text-align: center !important;
          }

          .tier-preview-passport {
            background: var(--stdr-passport-bg) !important;
            border-width: 2px !important;
          }

          .tier-preview-plane span {
            font-size: 52px !important;
            line-height: 1 !important;
          }

          .tier-preview-reward {
            min-height: 142px !important;
            display: grid !important;
            align-content: center !important;
            gap: 5px !important;
            margin-top: auto;
            border-width: 2px !important;
            background: var(--stdr-reward-bg) !important;
          }

          .tier-preview-reward b,
          .tier-preview-reward small,
          .tier-preview-reward span {
            display: block;
            position: relative;
            z-index: 1;
          }

          .tier-preview-reward em {
            display: inline-grid;
            place-items: center;
            justify-self: start;
            margin-top: 8px;
            width: 92px;
            height: 42px;
            border-radius: 999px;
            border: 2px dashed var(--stdr-tier-accent);
            color: var(--stdr-tier-accent);
            background: color-mix(in srgb, var(--stdr-tier-accent) 12%, rgba(255,255,255,0.68));
            font-style: normal;
            font-size: 11px;
            font-weight: 950;
            transform: rotate(-4deg);
          }

          @media (max-width: 760px) {
            .tier-preview-grid {
              grid-template-columns: 1fr !important;
            }

            .tier-preview-card {
              min-height: auto !important;
            }

            .tier-preview-middle {
              grid-template-columns: 1fr !important;
            }

            .stdr-theme-unlock-strip {
              grid-template-columns: 1fr 1fr !important;
            }
          }

          /* Current tier should affect real app visuals strongly */
          .flight-dashboard-card {
            border-color: color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 62%, var(--border)) !important;
            box-shadow:
              0 18px 42px color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 18%, transparent),
              inset 0 0 0 1px color-mix(in srgb, var(--stdr-tier-accent-2, #0ea5e9) 14%, transparent) !important;
          }

          .flight-plane {
            color: var(--stdr-plane-color, #2563eb) !important;
            text-shadow:
              0 0 16px color-mix(in srgb, var(--stdr-plane-color, #2563eb) 62%, transparent),
              0 8px 22px rgba(15,23,42,0.28) !important;
          }

          .flight-dashboard-card.tracking-flight .flight-plane {
            filter:
              drop-shadow(0 0 12px color-mix(in srgb, var(--stdr-plane-color, #2563eb) 76%, white))
              drop-shadow(0 14px 24px color-mix(in srgb, var(--stdr-plane-color, #2563eb) 30%, transparent)) !important;
          }

          .flight-ticket {
            background: var(--stdr-ticket-bg, linear-gradient(135deg, #eff6ff, #dbeafe)) !important;
            color: var(--stdr-ticket-text, #1e3a8a) !important;
            border: 2px solid color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 44%, white) !important;
          }

          .passport-paper-page {
            background: var(--stdr-passport-bg, linear-gradient(135deg, #fffaf0, #eff6ff)) !important;
            border: 2px solid color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 42%, rgba(180,148,92,0.38)) !important;
          }

          .passport-emblem {
            background: linear-gradient(135deg, var(--stdr-tier-accent, #111827), var(--stdr-tier-accent-2, #2563eb)) !important;
            color: var(--stdr-ticket-text, white) !important;
          }

          .passport-page-stamp {
            border-color: color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 70%, rgba(37,99,235,0.34)) !important;
            color: var(--stdr-ticket-text, #1e3a8a) !important;
            background: color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 10%, rgba(255,255,255,0.56)) !important;
          }

          .arrival-reward-card {
            background:
              radial-gradient(circle at 12% 0%, color-mix(in srgb, var(--stdr-tier-accent-2, #0ea5e9) 25%, transparent), transparent 34%),
              var(--stdr-reward-bg, linear-gradient(135deg, var(--card-bg-solid), var(--soft-bg))) !important;
            border: 2px solid color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 48%, var(--border)) !important;
          }

          .arrival-stamp {
            border-color: color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 75%, var(--border)) !important;
            background: color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 14%, var(--accent-soft)) !important;
            color: var(--stdr-ticket-text, var(--accent-text)) !important;
          }

          .arrival-stamp b {
            color: var(--stdr-ticket-text, var(--accent-text)) !important;
          }

          .stdr-tier-captain .flight-ticket-main span,
          .stdr-tier-captain .flight-ticket-main h2,
          .stdr-tier-captain .flight-ticket-main p,
          .stdr-tier-captain .flight-ticket-main small,
          .stdr-tier-captain .flight-ticket-stub span,
          .stdr-tier-captain .flight-ticket-stub b,
          .stdr-tier-captain .flight-ticket-stub small {
            color: #fff7ed !important;
          }

          .stdr-tier-captain .passport-paper-page,
          .stdr-tier-captain.passport-paper-page {
            color: #fff7ed !important;
          }

          .dark-app .tier-preview-card,
          .dark-app .tier-preview-ticket,
          .dark-app .tier-preview-passport,
          .dark-app .tier-preview-plane,
          .dark-app .tier-preview-reward {
            border-color: color-mix(in srgb, var(--stdr-tier-accent) 44%, rgba(96,165,250,0.22)) !important;
          }

          /* Preview/real consistency pass: 기존 차별화 강도는 유지하고 실제 디자인과 미리보기를 일치 */
          .tier-preview-ticket-mock {
            min-height: 142px !important;
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) 68px !important;
            padding: 0 !important;
            overflow: hidden !important;
          }

          .tier-preview-ticket-mock .flight-ticket-main {
            padding: 14px !important;
            min-width: 0;
          }

          .tier-preview-ticket-mock .flight-ticket-main h2 {
            font-size: 30px !important;
            line-height: 1 !important;
            margin: 4px 0 !important;
          }

          .tier-preview-ticket-mock .flight-ticket-main p {
            margin: 0 0 10px !important;
            font-size: 11px !important;
            line-height: 1.3 !important;
          }

          .tier-preview-ticket-mock .flight-ticket-row {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 6px !important;
          }

          .tier-preview-ticket-mock .flight-ticket-row b {
            font-size: 13px !important;
          }

          .tier-preview-ticket-mock .flight-ticket-stub {
            display: grid !important;
            place-items: center !important;
            align-content: center !important;
            gap: 3px !important;
            border-left: 1px dashed color-mix(in srgb, var(--stdr-tier-accent) 42%, transparent) !important;
          }

          .passport-preview-mock {
            background: var(--stdr-passport-bg) !important;
            border: 2px solid color-mix(in srgb, var(--stdr-tier-accent) 36%, var(--border)) !important;
            box-shadow:
              inset 14px 0 22px color-mix(in srgb, var(--stdr-tier-accent) 10%, transparent),
              inset -14px 0 22px color-mix(in srgb, var(--stdr-tier-accent-2) 8%, transparent) !important;
            position: relative;
            overflow: hidden;
          }

          .passport-preview-mock::before {
            content: "";
            position: absolute;
            left: 12px;
            top: 12px;
            bottom: 12px;
            width: 5px;
            border-radius: 999px;
            background: color-mix(in srgb, var(--stdr-tier-accent) 34%, transparent);
          }

          .passport-preview-mock b {
            width: 56px;
            height: 56px;
            border-radius: 18px;
            display: grid !important;
            place-items: center;
            margin: 8px auto !important;
            background: linear-gradient(135deg, var(--stdr-tier-accent), var(--stdr-tier-accent-2));
            color: var(--stdr-ticket-text, white) !important;
            box-shadow: 0 10px 22px color-mix(in srgb, var(--stdr-tier-accent) 22%, transparent);
          }

          .passport-preview-mock em {
            display: inline-grid;
            place-items: center;
            width: 78px;
            height: 32px;
            margin-top: 4px;
            border-radius: 999px;
            border: 2px dashed var(--stdr-stamp-color, var(--stdr-tier-accent));
            color: var(--stdr-stamp-color, var(--stdr-tier-accent));
            background: color-mix(in srgb, var(--stdr-stamp-color, var(--stdr-tier-accent)) 10%, rgba(255,255,255,0.62));
            font-style: normal;
            font-size: 10px;
            font-weight: 950;
            transform: rotate(-4deg);
          }

          .tier-preview-plane-icon {
            color: var(--stdr-plane-color) !important;
            text-shadow:
              0 0 12px color-mix(in srgb, var(--stdr-plane-color) 54%, transparent),
              0 10px 22px rgba(15,23,42,0.22) !important;
            filter: drop-shadow(0 0 8px color-mix(in srgb, var(--stdr-plane-color) 45%, transparent)) !important;
          }

          .arrival-preview-mock {
            background: var(--stdr-reward-bg) !important;
            border: 2px solid color-mix(in srgb, var(--stdr-tier-accent) 36%, var(--border)) !important;
          }

          .arrival-preview-mock em {
            display: inline-grid;
            place-items: center;
            justify-self: start;
            width: 92px;
            height: 42px;
            margin-top: 8px;
            border-radius: 999px;
            border: 2px dashed var(--stdr-stamp-color, var(--stdr-tier-accent));
            color: var(--stdr-stamp-color, var(--stdr-tier-accent));
            background: color-mix(in srgb, var(--stdr-stamp-color, var(--stdr-tier-accent)) 12%, rgba(255,255,255,0.68));
            font-style: normal;
            font-size: 11px;
            font-weight: 950;
            transform: rotate(-4deg);
          }

          .passport-page-stamp,
          .arrival-stamp {
            border-color: var(--stdr-stamp-color, var(--stdr-tier-accent)) !important;
            color: var(--stdr-stamp-color, var(--stdr-tier-accent)) !important;
            background: color-mix(in srgb, var(--stdr-stamp-color, var(--stdr-tier-accent)) 10%, var(--accent-soft)) !important;
          }

          .passport-page-stamp b,
          .arrival-stamp b {
            color: var(--stdr-stamp-color, var(--stdr-tier-accent)) !important;
          }

          .stdr-tier-captain .flight-ticket-main span,
          .stdr-tier-captain .flight-ticket-main h2,
          .stdr-tier-captain .flight-ticket-main p,
          .stdr-tier-captain .flight-ticket-main small,
          .stdr-tier-captain .flight-ticket-main b,
          .stdr-tier-captain .flight-ticket-stub span,
          .stdr-tier-captain .flight-ticket-stub b,
          .stdr-tier-captain .flight-ticket-stub small,
          .tier-preview-ticket-mock.stdr-tier-captain * {
            color: #fff7ed !important;
          }

          .passport-preview-mock.stdr-tier-captain,
          .passport-paper-page.stdr-tier-captain {
            color: #fff7ed !important;
          }

          .passport-preview-mock.stdr-tier-captain span,
          .passport-preview-mock.stdr-tier-captain small,
          .passport-preview-mock.stdr-tier-captain em {
            color: #fff7ed !important;
          }

          /* Ticket differentiation + light-mode readability fix */
          .flight-ticket {
            position: relative;
            isolation: isolate;
            overflow: hidden;
            border-width: 2px !important;
          }

          .flight-ticket::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: -1;
            pointer-events: none;
            opacity: 0.95;
          }

          .flight-ticket::after {
            content: "";
            position: absolute;
            left: 14px;
            right: 14px;
            bottom: 10px;
            height: 5px;
            border-radius: 999px;
            pointer-events: none;
            background: color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 42%, transparent);
          }

          .flight-ticket.stdr-tier-economy,
          .stdr-tier-economy .flight-ticket {
            background:
              linear-gradient(135deg, #ffffff 0%, #e0f2fe 42%, #bfdbfe 100%) !important;
            color: #0f172a !important;
            border-color: rgba(37,99,235,0.34) !important;
          }

          .flight-ticket.stdr-tier-economy::before,
          .stdr-tier-economy .flight-ticket::before {
            background:
              radial-gradient(circle at 12% 18%, rgba(59,130,246,0.20), transparent 26%),
              repeating-linear-gradient(135deg, rgba(37,99,235,0.08) 0 8px, transparent 8px 18px);
          }

          .flight-ticket.stdr-tier-premium,
          .stdr-tier-premium .flight-ticket {
            background:
              linear-gradient(135deg, #fff7fb 0%, #f5f3ff 34%, #fce7f3 72%, #e9d5ff 100%) !important;
            color: #3b0764 !important;
            border-color: rgba(168,85,247,0.42) !important;
          }

          .flight-ticket.stdr-tier-premium::before,
          .stdr-tier-premium .flight-ticket::before {
            background:
              radial-gradient(circle at 16% 18%, rgba(236,72,153,0.24), transparent 26%),
              radial-gradient(circle at 88% 82%, rgba(124,58,237,0.20), transparent 30%),
              repeating-linear-gradient(45deg, rgba(236,72,153,0.09) 0 7px, transparent 7px 18px);
          }

          .flight-ticket.stdr-tier-business,
          .stdr-tier-business .flight-ticket {
            background:
              linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 42%, #99f6e4 100%) !important;
            color: #064e3b !important;
            border-color: rgba(15,118,110,0.42) !important;
          }

          .flight-ticket.stdr-tier-business::before,
          .stdr-tier-business .flight-ticket::before {
            background:
              radial-gradient(circle at 18% 18%, rgba(20,184,166,0.22), transparent 28%),
              linear-gradient(90deg, rgba(15,118,110,0.10), transparent 26%, rgba(45,212,191,0.12));
          }

          .flight-ticket.stdr-tier-first,
          .stdr-tier-first .flight-ticket {
            background:
              linear-gradient(135deg, #fff7ed 0%, #fffbeb 34%, #fde68a 74%, #fbbf24 100%) !important;
            color: #451a03 !important;
            border-color: rgba(180,83,9,0.48) !important;
          }

          .flight-ticket.stdr-tier-first::before,
          .stdr-tier-first .flight-ticket::before {
            background:
              radial-gradient(circle at 14% 18%, rgba(251,191,36,0.30), transparent 30%),
              repeating-linear-gradient(135deg, rgba(180,83,9,0.12) 0 9px, transparent 9px 22px);
          }

          .flight-ticket.stdr-tier-captain,
          .stdr-tier-captain .flight-ticket {
            background:
              linear-gradient(135deg, #111827 0%, #451a03 42%, #b45309 72%, #fbbf24 100%) !important;
            color: #fff7ed !important;
            border-color: rgba(251,191,36,0.72) !important;
            box-shadow:
              inset 0 0 0 1px rgba(255,247,237,0.22),
              0 0 0 2px rgba(251,191,36,0.18),
              0 18px 38px rgba(180,83,9,0.24) !important;
          }

          .flight-ticket.stdr-tier-captain::before,
          .stdr-tier-captain .flight-ticket::before {
            background:
              radial-gradient(circle at 14% 22%, rgba(251,191,36,0.26), transparent 30%),
              linear-gradient(90deg, rgba(255,255,255,0.08), transparent 36%),
              repeating-linear-gradient(135deg, rgba(251,191,36,0.14) 0 8px, transparent 8px 20px);
          }

          .flight-ticket.stdr-tier-captain::after,
          .stdr-tier-captain .flight-ticket::after {
            background: rgba(255,247,237,0.72) !important;
          }

          .flight-ticket-main,
          .flight-ticket-stub {
            position: relative;
            z-index: 1;
          }

          .flight-ticket-main h2,
          .flight-ticket-main p,
          .flight-ticket-main b,
          .flight-ticket-main span,
          .flight-ticket-main small,
          .flight-ticket-stub b,
          .flight-ticket-stub span,
          .flight-ticket-stub small {
            color: currentColor !important;
            opacity: 1 !important;
            text-shadow: none !important;
          }

          .flight-ticket-main span,
          .flight-ticket-main small,
          .flight-ticket-stub span,
          .flight-ticket-stub small {
            opacity: 0.72 !important;
          }

          .flight-ticket-row > div {
            background: rgba(255,255,255,0.36);
            border: 1px solid rgba(255,255,255,0.34);
            border-radius: 14px;
            padding: 7px 8px;
          }

          .stdr-tier-captain .flight-ticket-row > div,
          .flight-ticket.stdr-tier-captain .flight-ticket-row > div {
            background: rgba(15,23,42,0.24) !important;
            border-color: rgba(255,247,237,0.22) !important;
          }

          .flight-ticket-stub {
            background: color-mix(in srgb, var(--stdr-tier-accent, #2563eb) 12%, rgba(255,255,255,0.20));
          }

          .stdr-tier-captain .flight-ticket-stub,
          .flight-ticket.stdr-tier-captain .flight-ticket-stub {
            background: rgba(3,7,18,0.18) !important;
          }

          /* Light mode readability after tier themes */
          :not(.dark-app) .flight-mileage-card,
          :not(.dark-app) .flight-passport-book,
          :not(.dark-app) .flight-side-card,
          :not(.dark-app) .flight-status-panel-inner,
          :not(.dark-app) .flight-ticket-panel-inner,
          :not(.dark-app) .arrival-reward-card,
          :not(.dark-app) .arrival-airline-tier,
          :not(.dark-app) .passport-page-shell,
          :not(.dark-app) .tier-preview-modal,
          :not(.dark-app) .unlock-list-modal {
            color: #0f172a !important;
          }

          :not(.dark-app) .flight-mileage-card small,
          :not(.dark-app) .flight-mileage-card span,
          :not(.dark-app) .flight-passport-book span,
          :not(.dark-app) .flight-passport-book small,
          :not(.dark-app) .arrival-reward-card p,
          :not(.dark-app) .arrival-airline-tier span,
          :not(.dark-app) .arrival-airline-tier small,
          :not(.dark-app) .tier-preview-head p,
          :not(.dark-app) .tier-preview-title small,
          :not(.dark-app) .passport-cover-page p,
          :not(.dark-app) .passport-cover-stats span,
          :not(.dark-app) .passport-page-label,
          :not(.dark-app) .passport-page-stamp span,
          :not(.dark-app) .passport-page-stamp small {
            color: #475569 !important;
            opacity: 1 !important;
          }

          :not(.dark-app) .stdr-theme-button,
          :not(.dark-app) .stdr-tier-preview-button,
          :not(.dark-app) .passport-open-button,
          :not(.dark-app) .flight-unlock-box-head button,
          :not(.dark-app) .top-appearance-button {
            color: #0f172a !important;
            background: rgba(255,255,255,0.88) !important;
            border-color: color-mix(in srgb, var(--accent) 28%, #dbe4ee) !important;
          }

          :not(.dark-app) .stdr-air-tier-card b,
          :not(.dark-app) .arrival-airline-tier b,
          :not(.dark-app) .passport-stat-list b,
          :not(.dark-app) .passport-cover-stats b {
            color: #0f172a !important;
          }

          :not(.dark-app) .stdr-tier-captain .stdr-air-tier-card span,
          :not(.dark-app) .stdr-tier-captain .flight-mileage-card.stdr-air-tier-card span {
            color: #92400e !important;
          }

          .tier-preview-ticket-mock {
            min-height: 152px !important;
          }

          .tier-preview-ticket-mock .flight-ticket-row > div {
            padding: 6px 7px !important;
          }

          /* Selected theme should control the overall app color, even when user's class is Captain */
          .top-mode-controls,
          .stdr-theme-button,
          .stdr-tier-preview-button,
          .passport-open-button,
          .flight-unlock-box-head button,
          .flight-fullscreen-open {
            border-color: color-mix(in srgb, var(--accent) 34%, var(--border)) !important;
          }

          .top-mode-button.active,
          .top-mode-button.flight.active {
            background: linear-gradient(135deg, var(--accent), var(--accent-dark)) !important;
            box-shadow: 0 8px 18px var(--accent-shadow) !important;
          }

          .stdr-theme-button {
            background:
              linear-gradient(135deg, var(--accent-soft), var(--accent-soft-2)) !important;
            color: var(--accent-text) !important;
          }

          .flight-dashboard-card {
            border-color: color-mix(in srgb, var(--accent) 52%, var(--border)) !important;
            box-shadow:
              0 18px 42px color-mix(in srgb, var(--accent) 18%, transparent),
              inset 0 0 0 1px color-mix(in srgb, var(--accent) 12%, transparent) !important;
          }

          .flight-dashboard-card .flight-kicker,
          .flight-panel-head b,
          .flight-mileage-card.stdr-air-tier-card span {
            color: var(--accent-text) !important;
          }

          .flight-dashboard-card .flight-route-line {
            stroke: var(--accent) !important;
            filter: drop-shadow(0 0 8px color-mix(in srgb, var(--accent) 68%, transparent)) !important;
          }

          .stdr-tier-progress i {
            background: linear-gradient(90deg, var(--accent), var(--accent-dark), var(--accent-soft-3)) !important;
          }

          /* Dark mode class readability */
          .dark-app .stdr-air-tier-card {
            background:
              radial-gradient(circle at 12% 0%, color-mix(in srgb, var(--accent) 24%, transparent), transparent 42%),
              linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.94)) !important;
            border: 1px solid color-mix(in srgb, var(--accent) 42%, rgba(96,165,250,0.28)) !important;
            color: #f8fafc !important;
          }

          .dark-app .stdr-air-tier-card span,
          .dark-app .stdr-air-tier-card small {
            color: #cbd5e1 !important;
            opacity: 1 !important;
          }

          .dark-app .stdr-air-tier-card > b {
            color: #ffffff !important;
            text-shadow:
              0 0 10px color-mix(in srgb, var(--accent) 32%, transparent),
              0 2px 12px rgba(0,0,0,0.28);
          }

          .dark-app .stdr-air-tier-card.stdr-class-captain > b {
            color: #fef3c7 !important;
            text-shadow:
              0 0 14px rgba(251,191,36,0.52),
              0 2px 12px rgba(0,0,0,0.40);
          }

          .dark-app .stdr-air-tier-card.stdr-class-first > b {
            color: #fde68a !important;
          }

          .dark-app .stdr-air-tier-card.stdr-class-business > b {
            color: #ccfbf1 !important;
          }

          .dark-app .stdr-air-tier-card.stdr-class-premium > b {
            color: #fce7f3 !important;
          }

          .dark-app .stdr-tier-progress {
            background: rgba(2,6,23,0.82) !important;
            border-color: color-mix(in srgb, var(--accent) 32%, rgba(148,163,184,0.26)) !important;
          }

          .dark-app .stdr-tier-preview-button {
            background: rgba(2,6,23,0.72) !important;
            color: #f8fafc !important;
            border-color: color-mix(in srgb, var(--accent) 38%, rgba(148,163,184,0.28)) !important;
          }

          /* Keep ticket/passport/plane design based on the real class, not selected global theme */
          .flight-ticket,
          .passport-paper-page,
          .arrival-reward-card {
            --real-class-note: "class visual remains separate from selected app theme";
          }

          /* Mode-aware ticket/passport designs: light and dark use different palettes */
          :not(.dark-app) .flight-ticket.stdr-tier-economy,
          :not(.dark-app) .stdr-tier-economy .flight-ticket {
            background:
              linear-gradient(135deg, #ffffff 0%, #e0f2fe 44%, #bfdbfe 100%) !important;
            color: #0f172a !important;
            border-color: rgba(37,99,235,0.34) !important;
          }

          :not(.dark-app) .flight-ticket.stdr-tier-premium,
          :not(.dark-app) .stdr-tier-premium .flight-ticket {
            background:
              linear-gradient(135deg, #fff7fb 0%, #f5f3ff 36%, #fce7f3 72%, #e9d5ff 100%) !important;
            color: #3b0764 !important;
            border-color: rgba(168,85,247,0.42) !important;
          }

          :not(.dark-app) .flight-ticket.stdr-tier-business,
          :not(.dark-app) .stdr-tier-business .flight-ticket {
            background:
              linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 44%, #99f6e4 100%) !important;
            color: #064e3b !important;
            border-color: rgba(15,118,110,0.42) !important;
          }

          :not(.dark-app) .flight-ticket.stdr-tier-first,
          :not(.dark-app) .stdr-tier-first .flight-ticket {
            background:
              linear-gradient(135deg, #fff7ed 0%, #fffbeb 34%, #fde68a 74%, #fbbf24 100%) !important;
            color: #451a03 !important;
            border-color: rgba(180,83,9,0.48) !important;
          }

          :not(.dark-app) .flight-ticket.stdr-tier-captain,
          :not(.dark-app) .stdr-tier-captain .flight-ticket {
            background:
              linear-gradient(135deg, #111827 0%, #451a03 42%, #b45309 72%, #fbbf24 100%) !important;
            color: #fff7ed !important;
            border-color: rgba(251,191,36,0.72) !important;
          }

          .dark-app .flight-ticket.stdr-tier-economy,
          .dark-app .stdr-tier-economy .flight-ticket {
            background:
              linear-gradient(135deg, #020617 0%, #0f274f 48%, #1d4ed8 100%) !important;
            color: #dbeafe !important;
            border-color: rgba(96,165,250,0.58) !important;
            box-shadow:
              inset 0 0 0 1px rgba(147,197,253,0.14),
              0 18px 42px rgba(29,78,216,0.24) !important;
          }

          .dark-app .flight-ticket.stdr-tier-premium,
          .dark-app .stdr-tier-premium .flight-ticket {
            background:
              linear-gradient(135deg, #1e1038 0%, #581c87 46%, #be185d 100%) !important;
            color: #fce7f3 !important;
            border-color: rgba(244,114,182,0.58) !important;
            box-shadow:
              inset 0 0 0 1px rgba(244,114,182,0.16),
              0 18px 42px rgba(190,24,93,0.24) !important;
          }

          .dark-app .flight-ticket.stdr-tier-business,
          .dark-app .stdr-tier-business .flight-ticket {
            background:
              linear-gradient(135deg, #021713 0%, #064e3b 48%, #0f766e 100%) !important;
            color: #ccfbf1 !important;
            border-color: rgba(45,212,191,0.56) !important;
            box-shadow:
              inset 0 0 0 1px rgba(94,234,212,0.14),
              0 18px 42px rgba(15,118,110,0.24) !important;
          }

          .dark-app .flight-ticket.stdr-tier-first,
          .dark-app .stdr-tier-first .flight-ticket {
            background:
              linear-gradient(135deg, #1c1917 0%, #451a03 48%, #b45309 100%) !important;
            color: #fef3c7 !important;
            border-color: rgba(252,211,77,0.60) !important;
            box-shadow:
              inset 0 0 0 1px rgba(252,211,77,0.16),
              0 18px 42px rgba(180,83,9,0.26) !important;
          }

          .dark-app .flight-ticket.stdr-tier-captain,
          .dark-app .stdr-tier-captain .flight-ticket {
            background:
              linear-gradient(135deg, #030712 0%, #171717 36%, #713f12 72%, #fbbf24 100%) !important;
            color: #fff7ed !important;
            border-color: rgba(251,191,36,0.78) !important;
            box-shadow:
              inset 0 0 0 1px rgba(255,247,237,0.18),
              0 0 0 2px rgba(251,191,36,0.16),
              0 22px 54px rgba(251,191,36,0.20) !important;
          }

          .dark-app .flight-ticket-main h2,
          .dark-app .flight-ticket-main p,
          .dark-app .flight-ticket-main b,
          .dark-app .flight-ticket-main span,
          .dark-app .flight-ticket-main small,
          .dark-app .flight-ticket-stub b,
          .dark-app .flight-ticket-stub span,
          .dark-app .flight-ticket-stub small {
            color: currentColor !important;
            opacity: 1 !important;
          }

          .dark-app .flight-ticket-main span,
          .dark-app .flight-ticket-main small,
          .dark-app .flight-ticket-stub span,
          .dark-app .flight-ticket-stub small {
            opacity: 0.78 !important;
          }

          .dark-app .flight-ticket-row > div {
            background: rgba(2,6,23,0.28) !important;
            border-color: rgba(255,255,255,0.16) !important;
          }

          .dark-app .flight-ticket-stub {
            background: rgba(2,6,23,0.20) !important;
            border-left-color: rgba(255,255,255,0.22) !important;
          }

          :not(.dark-app) .passport-paper-page.stdr-tier-economy {
            background:
              linear-gradient(90deg, rgba(37,99,235,0.08), transparent 13%, transparent 87%, rgba(37,99,235,0.06)),
              linear-gradient(135deg, #ffffff 0%, #eff6ff 48%, #dbeafe 100%) !important;
            color: #0f172a !important;
          }

          :not(.dark-app) .passport-paper-page.stdr-tier-premium {
            background:
              linear-gradient(90deg, rgba(168,85,247,0.10), transparent 13%, transparent 87%, rgba(236,72,153,0.08)),
              linear-gradient(135deg, #fff7fb 0%, #f5f3ff 46%, #fce7f3 100%) !important;
            color: #3b0764 !important;
          }

          :not(.dark-app) .passport-paper-page.stdr-tier-business {
            background:
              linear-gradient(90deg, rgba(15,118,110,0.10), transparent 13%, transparent 87%, rgba(20,184,166,0.08)),
              linear-gradient(135deg, #ffffff 0%, #f0fdfa 44%, #ccfbf1 100%) !important;
            color: #064e3b !important;
          }

          :not(.dark-app) .passport-paper-page.stdr-tier-first {
            background:
              linear-gradient(90deg, rgba(180,83,9,0.12), transparent 13%, transparent 87%, rgba(251,191,36,0.12)),
              linear-gradient(135deg, #fffaf0 0%, #fffbeb 44%, #fde68a 100%) !important;
            color: #451a03 !important;
          }

          :not(.dark-app) .passport-paper-page.stdr-tier-captain {
            background:
              linear-gradient(90deg, rgba(251,191,36,0.16), transparent 13%, transparent 87%, rgba(251,191,36,0.12)),
              linear-gradient(135deg, #111827 0%, #451a03 48%, #b45309 100%) !important;
            color: #fff7ed !important;
          }

          .dark-app .passport-paper-page.stdr-tier-economy {
            background:
              linear-gradient(90deg, rgba(96,165,250,0.13), transparent 13%, transparent 87%, rgba(96,165,250,0.10)),
              linear-gradient(135deg, #020617 0%, #0f172a 48%, #1e3a8a 100%) !important;
            color: #dbeafe !important;
            border-color: rgba(96,165,250,0.44) !important;
          }

          .dark-app .passport-paper-page.stdr-tier-premium {
            background:
              linear-gradient(90deg, rgba(244,114,182,0.15), transparent 13%, transparent 87%, rgba(168,85,247,0.13)),
              linear-gradient(135deg, #16092b 0%, #3b0764 48%, #831843 100%) !important;
            color: #fce7f3 !important;
            border-color: rgba(244,114,182,0.44) !important;
          }

          .dark-app .passport-paper-page.stdr-tier-business {
            background:
              linear-gradient(90deg, rgba(45,212,191,0.15), transparent 13%, transparent 87%, rgba(16,185,129,0.12)),
              linear-gradient(135deg, #01110e 0%, #022c22 48%, #0f766e 100%) !important;
            color: #ccfbf1 !important;
            border-color: rgba(45,212,191,0.42) !important;
          }

          .dark-app .passport-paper-page.stdr-tier-first {
            background:
              linear-gradient(90deg, rgba(252,211,77,0.14), transparent 13%, transparent 87%, rgba(180,83,9,0.13)),
              linear-gradient(135deg, #1c1917 0%, #451a03 48%, #92400e 100%) !important;
            color: #fef3c7 !important;
            border-color: rgba(252,211,77,0.44) !important;
          }

          .dark-app .passport-paper-page.stdr-tier-captain {
            background:
              linear-gradient(90deg, rgba(251,191,36,0.18), transparent 13%, transparent 87%, rgba(251,191,36,0.14)),
              linear-gradient(135deg, #030712 0%, #171717 42%, #713f12 100%) !important;
            color: #fff7ed !important;
            border-color: rgba(251,191,36,0.58) !important;
            box-shadow:
              inset 22px 0 34px rgba(251,191,36,0.16),
              inset -22px 0 34px rgba(251,191,36,0.10),
              0 0 0 2px rgba(251,191,36,0.12),
              0 20px 52px rgba(0,0,0,0.30) !important;
          }

          .dark-app .passport-paper-page .passport-cover-page p,
          .dark-app .passport-paper-page .passport-cover-stats span,
          .dark-app .passport-paper-page .passport-page-label,
          .dark-app .passport-paper-page .passport-page-stamp span,
          .dark-app .passport-paper-page .passport-page-stamp small,
          .dark-app .passport-paper-page .passport-empty-page {
            color: currentColor !important;
            opacity: 0.74 !important;
          }

          .dark-app .passport-paper-page .passport-cover-stats b,
          .dark-app .passport-paper-page h3,
          .dark-app .passport-paper-page .passport-page-stamp b {
            color: currentColor !important;
          }

          .dark-app .passport-paper-page .passport-cover-stats div,
          .dark-app .passport-paper-page .passport-page-stamp {
            background: rgba(2,6,23,0.24) !important;
            border-color: color-mix(in srgb, currentColor 22%, transparent) !important;
          }

          .dark-app .passport-preview-mock,
          .dark-app .tier-preview-ticket-mock {
            color: inherit !important;
          }

          /* STDR Air cumulative-mileage tier clarity */
          .stdr-class-mile-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
            margin-top: 10px;
          }

          .stdr-class-mile-grid div {
            border: 1px solid color-mix(in srgb, var(--accent) 24%, var(--border));
            border-radius: 16px;
            background: color-mix(in srgb, var(--accent-soft) 52%, var(--card-bg-solid));
            padding: 9px 10px;
          }

          .stdr-class-mile-grid span {
            display: block;
            font-size: 10px !important;
            font-weight: 900;
            color: var(--text-sub) !important;
          }

          .stdr-class-mile-grid strong {
            display: block;
            margin-top: 3px;
            font-size: 14px;
            font-weight: 950;
            color: var(--text-main);
          }

          .dark-app .stdr-class-mile-grid div {
            background: rgba(2,6,23,0.38) !important;
            border-color: color-mix(in srgb, var(--accent) 34%, rgba(148,163,184,0.24)) !important;
          }

          .dark-app .stdr-class-mile-grid strong {
            color: #f8fafc !important;
          }

          /* Place passport open button clearly below the stamp-count text */
          .flight-passport-card {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .flight-passport-card .passport-open-button {
            margin-top: 10px !important;
            align-self: stretch;
          }

          /* Theme affects passport/detail buttons */
          .passport-open-button,
          .flight-unlock-box-head button,
          .stdr-tier-preview-button,
          .unlock-list-head button {
            background:
              linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, var(--card-bg-solid)), color-mix(in srgb, var(--accent-dark) 10%, var(--input-bg))) !important;
            border: 1px solid color-mix(in srgb, var(--accent) 42%, var(--border)) !important;
            color: var(--accent-text) !important;
            box-shadow: 0 8px 18px color-mix(in srgb, var(--accent) 12%, transparent) !important;
          }

          .passport-open-button:hover,
          .flight-unlock-box-head button:hover,
          .stdr-tier-preview-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 12px 24px color-mix(in srgb, var(--accent) 18%, transparent) !important;
          }

          .dark-app .passport-open-button,
          .dark-app .flight-unlock-box-head button,
          .dark-app .stdr-tier-preview-button,
          .dark-app .unlock-list-head button {
            background:
              linear-gradient(135deg, color-mix(in srgb, var(--accent) 22%, #0f172a), color-mix(in srgb, var(--accent-dark) 18%, #111827)) !important;
            border-color: color-mix(in srgb, var(--accent) 50%, rgba(148,163,184,0.30)) !important;
            color: #f8fafc !important;
          }

          /* Remove the extra "적용중" suffix from theme button */
          .stdr-theme-button::after {
            content: none !important;
          }

          .dev-total-mileage-box {
            display: grid;
            gap: 8px;
            border: 1px solid color-mix(in srgb, var(--accent) 24%, var(--border));
            border-radius: 16px;
            padding: 10px;
            background: color-mix(in srgb, var(--accent-soft) 42%, var(--card-bg-solid));
          }

          .dev-total-mileage-box > b {
            color: var(--text-main);
            font-size: 13px;
          }

          .dev-total-mileage-box > small,
          .dev-total-mileage-box > em {
            color: var(--text-sub);
            font-size: 11px;
            font-style: normal;
            font-weight: 800;
            line-height: 1.35;
          }

          .dev-mileage-actions {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px;
          }

          .dark-app .dev-total-mileage-box {
            background: rgba(2,6,23,0.34) !important;
            border-color: color-mix(in srgb, var(--accent) 32%, rgba(148,163,184,0.24)) !important;
          }

          /* Final fix: ticket and passport must follow the selected unlocked theme */
          .flight-ticket.stdr-tier-economy,
          .stdr-tier-economy .flight-ticket {
            --selected-ticket-note: "economy selected";
          }

          .flight-ticket.stdr-tier-premium,
          .stdr-tier-premium .flight-ticket {
            --selected-ticket-note: "premium selected";
          }

          .flight-ticket.stdr-tier-business,
          .stdr-tier-business .flight-ticket {
            --selected-ticket-note: "business selected";
          }

          .flight-ticket.stdr-tier-first,
          .stdr-tier-first .flight-ticket {
            --selected-ticket-note: "first selected";
          }

          .flight-ticket.stdr-tier-captain,
          .stdr-tier-captain .flight-ticket {
            --selected-ticket-note: "captain selected";
          }

          .passport-paper-page.stdr-tier-economy,
          .passport-paper-page.stdr-tier-premium,
          .passport-paper-page.stdr-tier-business,
          .passport-paper-page.stdr-tier-first,
          .passport-paper-page.stdr-tier-captain {
            --selected-passport-note: "passport follows selected theme";
          }

          .flight-dashboard-card .flight-ticket,
          .easy-flight-controls .flight-ticket,
          .flight-side-card .flight-ticket {
            border-color: color-mix(in srgb, var(--stdr-tier-accent) 42%, var(--border)) !important;
          }

          .passport-paper-page {
            border-color: color-mix(in srgb, var(--stdr-tier-accent) 42%, rgba(180,148,92,0.38)) !important;
          }

          /* Mobile flight mode + dark theme controls */
          .mobile-flight-mode-toolbar {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
            padding: 10px;
            border-radius: 22px;
            background:
              radial-gradient(circle at 12% 0%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 36%),
              var(--card-bg-solid);
            border: 1px solid color-mix(in srgb, var(--accent) 28%, var(--border));
            box-shadow: 0 10px 28px color-mix(in srgb, var(--accent) 10%, transparent);
          }

          .mobile-theme-button,
          .mobile-flight-button {
            border: 1px solid color-mix(in srgb, var(--accent) 36%, var(--border));
            border-radius: 16px;
            background:
              linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, var(--card-bg-solid)), color-mix(in srgb, var(--accent-dark) 8%, var(--input-bg)));
            color: var(--text-main);
            font-size: 11px;
            font-weight: 950;
            padding: 10px 8px;
            cursor: pointer;
            min-height: 42px;
          }

          .mobile-flight-button.active {
            color: #ffffff;
            background: linear-gradient(135deg, var(--accent), var(--accent-dark));
            box-shadow: 0 10px 22px var(--accent-shadow);
          }

          .mobile-flight-mode-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            padding: 12px;
            border-radius: 20px;
            background: var(--card-bg-solid);
            border: 1px solid color-mix(in srgb, var(--accent) 28%, var(--border));
            margin-bottom: 10px;
          }

          .mobile-flight-mode-head b,
          .mobile-flight-mode-head span {
            display: block;
          }

          .mobile-flight-mode-head b {
            font-size: 14px;
            color: var(--text-main);
          }

          .mobile-flight-mode-head span {
            margin-top: 2px;
            color: var(--text-sub);
            font-size: 11px;
            line-height: 1.35;
            font-weight: 750;
          }

          .mobile-flight-mode-head button {
            border: 1px solid color-mix(in srgb, var(--accent) 36%, var(--border));
            border-radius: 999px;
            background: var(--input-bg);
            color: var(--text-main);
            font-weight: 950;
            padding: 8px 10px;
            cursor: pointer;
            flex: 0 0 auto;
          }

          @media (max-width: 900px) {
            .mobile-flight-feature-shell.open {
              display: grid !important;
              gap: 10px !important;
              max-height: none !important;
              overflow: visible !important;
              opacity: 1 !important;
              transform: none !important;
              pointer-events: auto !important;
            }

            .mobile-flight-feature-shell.closed {
              display: none !important;
            }

            .flight-dashboard-card {
              border-radius: 24px !important;
              padding: 12px !important;
              overflow: hidden !important;
            }

            .flight-dashboard-head {
              display: grid !important;
              grid-template-columns: 1fr !important;
              gap: 10px !important;
            }

            .flight-route-summary {
              width: 100% !important;
            }

            .flight-mileage-panel {
              grid-template-columns: 1fr !important;
            }

            .flight-dashboard-grid {
              grid-template-columns: 1fr !important;
            }

            .flight-map-tools {
              flex-wrap: wrap !important;
              justify-content: flex-start !important;
            }

            .flight-map-viewport {
              min-height: 280px !important;
              max-height: 56vh !important;
              overflow: auto !important;
              -webkit-overflow-scrolling: touch;
            }

            .flight-unlock-box {
              min-width: 0 !important;
            }

            .flight-unlock-strip {
              grid-template-rows: repeat(2, minmax(54px, auto)) !important;
              grid-auto-columns: minmax(76px, 88px) !important;
            }

            .easy-flight-controls {
              display: grid !important;
              gap: 10px !important;
            }

            .easy-flight-boarding-pass {
              min-height: auto !important;
            }
          }

          .dark-app .mobile-flight-mode-toolbar,
          .dark-app .mobile-flight-mode-head {
            background:
              radial-gradient(circle at 12% 0%, color-mix(in srgb, var(--accent) 20%, transparent), transparent 36%),
              rgba(15,23,42,0.96) !important;
            border-color: color-mix(in srgb, var(--accent) 36%, rgba(148,163,184,0.26)) !important;
            color: var(--text-main) !important;
          }

          .dark-app .mobile-theme-button,
          .dark-app .mobile-flight-button,
          .dark-app .mobile-flight-mode-head button {
            background:
              linear-gradient(135deg, color-mix(in srgb, var(--accent) 18%, #0f172a), color-mix(in srgb, var(--accent-dark) 14%, #111827)) !important;
            border-color: color-mix(in srgb, var(--accent) 42%, rgba(148,163,184,0.28)) !important;
            color: #f8fafc !important;
          }

          .dark-app .mobile-flight-button.active {
            background: linear-gradient(135deg, var(--accent), var(--accent-dark)) !important;
            color: #ffffff !important;
          }

          /* Mobile passport modal fix: prevent right side clipping */
          @media (max-width: 900px) {
            .passport-page-overlay {
              place-items: start center !important;
              padding: 10px !important;
              overflow-y: auto !important;
              overflow-x: hidden !important;
              -webkit-overflow-scrolling: touch;
            }

            .passport-page-shell {
              width: 100% !important;
              max-width: 100% !important;
              max-height: none !important;
              overflow: visible !important;
              border-radius: 24px !important;
              padding: 12px !important;
              margin: 0 auto 12px !important;
              box-sizing: border-box !important;
            }

            .passport-page-top {
              gap: 8px !important;
              align-items: flex-start !important;
            }

            .passport-page-top h2 {
              font-size: 20px !important;
              line-height: 1.15 !important;
            }

            .passport-page-top span {
              font-size: 10px !important;
              letter-spacing: 1.2px !important;
            }

            .passport-page-top button {
              width: 34px !important;
              height: 34px !important;
              flex: 0 0 34px !important;
            }

            .passport-book-layout {
              grid-template-columns: 34px minmax(0, 1fr) 34px !important;
              gap: 6px !important;
              width: 100% !important;
              max-width: 100% !important;
              align-items: stretch !important;
              overflow: visible !important;
              box-sizing: border-box !important;
            }

            .passport-page-nav {
              width: 34px !important;
              min-width: 34px !important;
              border-radius: 16px !important;
              font-size: 26px !important;
              padding: 0 !important;
            }

            .passport-paper-page {
              min-width: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              min-height: 0 !important;
              border-radius: 22px !important;
              padding: 14px !important;
              overflow: hidden !important;
              box-sizing: border-box !important;
            }

            .passport-cover-page {
              min-height: 0 !important;
              gap: 10px !important;
              align-content: start !important;
              padding: 4px 0 !important;
            }

            .passport-emblem {
              width: 76px !important;
              height: 76px !important;
              border-radius: 22px !important;
              font-size: 18px !important;
            }

            .passport-cover-page h3 {
              font-size: 22px !important;
              line-height: 1.12 !important;
            }

            .passport-cover-page p {
              font-size: 12px !important;
              line-height: 1.4 !important;
              max-width: 100% !important;
            }

            .passport-cover-stats {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              width: 100% !important;
              max-width: 100% !important;
              gap: 8px !important;
            }

            .passport-cover-stats div {
              min-width: 0 !important;
              padding: 10px 8px !important;
              border-radius: 16px !important;
            }

            .passport-cover-stats b {
              font-size: 16px !important;
              word-break: keep-all !important;
            }

            .passport-page-grid {
              grid-template-columns: 1fr !important;
              gap: 10px !important;
            }

            .passport-page-stamp {
              min-height: 94px !important;
              border-radius: 18px !important;
              padding: 10px !important;
            }

            .passport-page-stamp b {
              font-size: 18px !important;
            }

            .passport-country-stats {
              gap: 6px !important;
              max-height: 92px !important;
              overflow-y: auto !important;
              padding-right: 2px !important;
            }

            .passport-country-stats span {
              font-size: 10px !important;
              padding: 5px 8px !important;
            }
          }

          @media (max-width: 420px) {
            .passport-page-overlay {
              padding: 8px 6px !important;
            }

            .passport-book-layout {
              grid-template-columns: 28px minmax(0, 1fr) 28px !important;
              gap: 4px !important;
            }

            .passport-page-nav {
              width: 28px !important;
              min-width: 28px !important;
              font-size: 22px !important;
              border-radius: 14px !important;
            }

            .passport-page-shell {
              padding: 10px !important;
              border-radius: 20px !important;
            }

            .passport-paper-page {
              padding: 12px !important;
              border-radius: 18px !important;
            }

            .passport-cover-stats {
              grid-template-columns: 1fr !important;
            }
          }

          /* Tablet layout fix: locked destinations, passport stats, and map buttons */
          @media (min-width: 721px) and (max-width: 1180px) {
            .flight-dashboard-card {
              max-width: 100% !important;
              overflow: hidden !important;
              padding: 14px !important;
            }

            .flight-dashboard-head {
              grid-template-columns: 1fr !important;
              gap: 12px !important;
            }

            .flight-route-summary {
              justify-self: stretch !important;
              width: 100% !important;
            }

            .flight-mileage-panel {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 10px !important;
              width: 100% !important;
              max-width: 100% !important;
              overflow: visible !important;
            }

            .flight-mileage-card,
            .flight-unlock-box,
            .flight-passport-book {
              min-width: 0 !important;
              max-width: 100% !important;
              box-sizing: border-box !important;
            }

            .flight-unlock-box {
              grid-column: 1 / -1 !important;
              width: 100% !important;
              overflow: visible !important;
              padding: 12px !important;
              border-radius: 22px !important;
              background: var(--card-bg-solid);
              border: 1px solid color-mix(in srgb, var(--accent) 24%, var(--border));
            }

            .flight-unlock-box-head {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              gap: 10px !important;
              width: 100% !important;
            }

            .flight-unlock-box-head button {
              display: inline-flex !important;
              flex: 0 0 auto !important;
              white-space: nowrap !important;
              min-width: 92px !important;
              justify-content: center !important;
            }

            .flight-unlock-strip {
              display: grid !important;
              grid-auto-flow: column !important;
              grid-auto-columns: minmax(86px, 100px) !important;
              grid-template-rows: repeat(2, minmax(56px, auto)) !important;
              gap: 8px !important;
              width: 100% !important;
              max-width: 100% !important;
              overflow-x: auto !important;
              overflow-y: hidden !important;
              padding: 4px 6px 10px 2px !important;
              -webkit-overflow-scrolling: touch;
              scrollbar-width: thin;
            }

            .flight-unlock-strip button {
              width: 100% !important;
              min-width: 0 !important;
              min-height: 56px !important;
              box-sizing: border-box !important;
            }

            .flight-passport-book {
              overflow: hidden !important;
              padding: 14px !important;
            }

            .passport-stat-list,
            .passport-stamp-list {
              max-width: 100% !important;
              overflow-x: auto !important;
              overflow-y: hidden !important;
              -webkit-overflow-scrolling: touch;
              padding-bottom: 8px !important;
              scroll-snap-type: x proximity;
            }

            .passport-stat-list span,
            .passport-stamp-list span {
              flex: 0 0 auto !important;
              scroll-snap-align: start;
            }

            .flight-dashboard-grid {
              grid-template-columns: 1fr !important;
              gap: 12px !important;
              width: 100% !important;
              max-width: 100% !important;
              overflow: visible !important;
            }

            .flight-panel-head {
              display: grid !important;
              grid-template-columns: 1fr !important;
              gap: 10px !important;
              align-items: start !important;
            }

            .flight-map-tools {
              display: flex !important;
              flex-wrap: wrap !important;
              justify-content: flex-start !important;
              align-items: center !important;
              gap: 8px !important;
              width: 100% !important;
              max-width: 100% !important;
              overflow: visible !important;
            }

            .flight-pick-tabs,
            .flight-zoom-controls {
              flex: 0 0 auto !important;
              max-width: 100% !important;
            }

            .flight-pick-tabs {
              display: flex !important;
              flex-wrap: wrap !important;
              gap: 6px !important;
            }

            .flight-zoom-controls {
              display: inline-flex !important;
              align-items: center !important;
              gap: 6px !important;
              white-space: nowrap !important;
              padding: 4px !important;
              border-radius: 999px !important;
              background: var(--input-bg) !important;
              border: 1px solid var(--border) !important;
            }

            .flight-zoom-controls button {
              width: 34px !important;
              min-width: 34px !important;
              height: 34px !important;
              padding: 0 !important;
              display: grid !important;
              place-items: center !important;
              border-radius: 999px !important;
              font-size: 18px !important;
              line-height: 1 !important;
            }

            .flight-zoom-controls span {
              min-width: 48px !important;
              text-align: center !important;
              font-size: 12px !important;
              font-weight: 950 !important;
              color: var(--text-main) !important;
            }

            .flight-map-viewport {
              width: 100% !important;
              max-width: 100% !important;
              overflow: auto !important;
              -webkit-overflow-scrolling: touch;
            }

            .flight-dashboard-card .flight-map {
              min-width: 920px !important;
            }
          }

          @media (min-width: 901px) and (max-width: 1180px) {
            .flight-dashboard-card .flight-map {
              height: clamp(520px, 62vh, 720px) !important;
              min-height: 520px !important;
            }
          }

          @media (min-width: 721px) and (max-width: 900px) {
            .flight-dashboard-card .flight-map {
              min-width: 820px !important;
              height: 520px !important;
              min-height: 520px !important;
            }
          }

          /* iPad/tablet hard fix: prevent clipping on 768~1366px and touch tablets */
          @media (min-width: 760px) and (max-width: 1366px), (pointer: coarse) and (min-width: 760px) {
            .app-shell,
            .main-grid,
            .easy-shell,
            .content-shell,
            .flight-feature-shell,
            .flight-dashboard-card,
            .flight-dashboard-grid,
            .flight-mileage-panel,
            .flight-passport-book,
            .flight-panel,
            .flight-map-shell,
            .flight-map-card {
              max-width: 100% !important;
              min-width: 0 !important;
              box-sizing: border-box !important;
            }

            .flight-feature-shell.open {
              overflow: visible !important;
              max-height: none !important;
              display: grid !important;
              gap: 12px !important;
            }

            .flight-dashboard-card {
              width: 100% !important;
              overflow: visible !important;
              padding: 14px !important;
              border-radius: 26px !important;
            }

            .flight-dashboard-head {
              display: grid !important;
              grid-template-columns: 1fr !important;
              gap: 12px !important;
              width: 100% !important;
            }

            .flight-route-summary {
              width: 100% !important;
              max-width: 100% !important;
              justify-self: stretch !important;
              display: grid !important;
              grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) !important;
            }

            .flight-route-summary span {
              min-width: 0 !important;
              width: 100% !important;
              box-sizing: border-box !important;
            }

            .flight-route-summary small,
            .flight-route-summary .flight-fullscreen-open {
              grid-column: 1 / -1 !important;
            }

            .flight-mileage-panel {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 10px !important;
              width: 100% !important;
              overflow: visible !important;
            }

            .flight-mileage-panel > * {
              min-width: 0 !important;
              max-width: 100% !important;
            }

            .flight-unlock-box {
              grid-column: 1 / -1 !important;
              width: 100% !important;
              min-width: 0 !important;
              max-width: 100% !important;
              overflow: visible !important;
              padding: 12px !important;
              border-radius: 22px !important;
              background: var(--card-bg-solid) !important;
              border: 1px solid color-mix(in srgb, var(--accent) 28%, var(--border)) !important;
              box-sizing: border-box !important;
            }

            .flight-unlock-box-head {
              display: grid !important;
              grid-template-columns: minmax(0, 1fr) auto !important;
              gap: 10px !important;
              align-items: center !important;
              width: 100% !important;
              max-width: 100% !important;
            }

            .flight-unlock-box-head span {
              min-width: 0 !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              white-space: nowrap !important;
            }

            .flight-unlock-box-head button {
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              flex: 0 0 auto !important;
              min-width: 104px !important;
              max-width: 140px !important;
              white-space: nowrap !important;
              padding: 8px 12px !important;
              box-sizing: border-box !important;
              visibility: visible !important;
              opacity: 1 !important;
            }

            .flight-unlock-strip {
              display: flex !important;
              flex-wrap: nowrap !important;
              gap: 8px !important;
              width: 100% !important;
              max-width: 100% !important;
              overflow-x: auto !important;
              overflow-y: hidden !important;
              padding: 6px 4px 12px !important;
              -webkit-overflow-scrolling: touch !important;
              scrollbar-width: thin !important;
            }

            .flight-unlock-strip button {
              flex: 0 0 86px !important;
              width: 86px !important;
              min-width: 86px !important;
              min-height: 58px !important;
              box-sizing: border-box !important;
            }

            .flight-passport-book {
              width: 100% !important;
              max-width: 100% !important;
              overflow: visible !important;
              padding: 14px !important;
              box-sizing: border-box !important;
            }

            .passport-stat-list,
            .passport-stamp-list {
              display: flex !important;
              flex-wrap: nowrap !important;
              width: 100% !important;
              max-width: 100% !important;
              overflow-x: auto !important;
              overflow-y: hidden !important;
              padding: 2px 4px 10px 0 !important;
              -webkit-overflow-scrolling: touch !important;
              scrollbar-width: thin !important;
            }

            .passport-stat-list span,
            .passport-stamp-list span {
              flex: 0 0 auto !important;
              min-width: 104px !important;
              max-width: 160px !important;
              box-sizing: border-box !important;
            }

            .flight-dashboard-grid {
              display: grid !important;
              grid-template-columns: 1fr !important;
              gap: 12px !important;
              width: 100% !important;
              max-width: 100% !important;
              overflow: visible !important;
            }

            .flight-panel-head {
              display: grid !important;
              grid-template-columns: 1fr !important;
              gap: 10px !important;
              width: 100% !important;
              max-width: 100% !important;
            }

            .flight-map-tools {
              display: grid !important;
              grid-template-columns: 1fr !important;
              gap: 8px !important;
              width: 100% !important;
              max-width: 100% !important;
              overflow: visible !important;
            }

            .flight-pick-tabs {
              display: grid !important;
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 8px !important;
              width: 100% !important;
            }

            .flight-pick-tabs button {
              min-width: 0 !important;
              width: 100% !important;
              box-sizing: border-box !important;
            }

            .flight-zoom-controls {
              display: grid !important;
              grid-template-columns: 40px minmax(58px, auto) 40px !important;
              gap: 8px !important;
              width: fit-content !important;
              max-width: 100% !important;
              align-items: center !important;
              justify-self: start !important;
              padding: 5px !important;
              border-radius: 999px !important;
              background: var(--input-bg) !important;
              border: 1px solid var(--border) !important;
              box-sizing: border-box !important;
            }

            .flight-zoom-controls button {
              width: 40px !important;
              min-width: 40px !important;
              height: 40px !important;
              padding: 0 !important;
              border-radius: 999px !important;
              display: grid !important;
              place-items: center !important;
              font-size: 20px !important;
              line-height: 1 !important;
              box-sizing: border-box !important;
            }

            .flight-zoom-controls span {
              min-width: 58px !important;
              text-align: center !important;
              font-size: 12px !important;
              font-weight: 950 !important;
              color: var(--text-main) !important;
              white-space: nowrap !important;
            }

            .flight-map-viewport {
              width: 100% !important;
              max-width: 100% !important;
              overflow: auto !important;
              -webkit-overflow-scrolling: touch !important;
              border-radius: 22px !important;
            }

            .flight-dashboard-card .flight-map {
              min-width: 760px !important;
              height: 520px !important;
              min-height: 520px !important;
            }
          }

          @media (min-width: 760px) and (max-width: 980px), (pointer: coarse) and (min-width: 760px) and (max-width: 980px) {
            .flight-mileage-panel {
              grid-template-columns: 1fr !important;
            }

            .flight-unlock-box {
              grid-column: auto !important;
            }

            .flight-dashboard-card .flight-map {
              min-width: 720px !important;
              height: 500px !important;
              min-height: 500px !important;
            }
          }

        `}
      </style>

      <button
        type="button"
        className="dev-time-toggle"
        onClick={() => setDevPanelOpen((value) => !value)}
        title="개발자 시간 테스트"
      >
        DEV
      </button>

      {devPanelOpen && (
        <div className="dev-time-panel">
          <div className="dev-time-head">
            <div>
              <b>Developer Time Test</b>
              <span>비행기 진행 테스트용</span>
            </div>
            <button type="button" onClick={() => setDevPanelOpen(false)}>×</button>
          </div>

          {!devAuthed ? (
            <div className="dev-time-login">
              <input
                type="password"
                value={devPassword}
                onChange={(e) => setDevPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && devPassword === "iinnuutt") {
                    setDevAuthed(true);
                    setDevPassword("");
                  }
                }}
                placeholder="개발자 비밀번호"
              />
              <button
                type="button"
                onClick={() => {
                  if (devPassword === "iinnuutt") {
                    setDevAuthed(true);
                    setDevPassword("");
                  } else {
                    alert("비밀번호가 맞지 않습니다.");
                  }
                }}
              >
                로그인
              </button>
            </div>
          ) : (
            <div className="dev-time-controls">
              <div className="dev-time-current">
                <span>현재 추가 시간</span>
                <b>
                  {Math.floor(devTimeOffsetSec / 3600)}시간 {Math.floor((devTimeOffsetSec % 3600) / 60)}분
                </b>
              </div>

              <div className="dev-time-grid">
                <button type="button" onClick={() => setDevTimeOffsetSec((v) => v + 60)}>+1분</button>
                <button type="button" onClick={() => setDevTimeOffsetSec((v) => v + 300)}>+5분</button>
                <button type="button" onClick={() => setDevTimeOffsetSec((v) => v + 1800)}>+30분</button>
                <button type="button" onClick={() => setDevTimeOffsetSec((v) => v + 3600)}>+1시간</button>
                <button type="button" onClick={() => setDevTimeOffsetSec((v) => Math.max(0, v - 300))}>-5분</button>
                <button type="button" onClick={() => setDevTimeOffsetSec(0)}>초기화</button>
              </div>

              <div className="dev-flight-tools">
                <b>Flight Developer Tools</b>
                <label>
                  마일리지 추가
                  <input
                    type="number"
                    value={devMileageAmount}
                    onChange={(e) => setDevMileageAmount(e.target.value)}
                    min="0"
                  />
                </label>
                <button type="button" onClick={addDevFlightMiles}>마일리지 올리기</button>

                <label>
                  마일리지 삭제
                  <input
                    type="number"
                    value={devMileageRemoveAmount}
                    onChange={(e) => setDevMileageRemoveAmount(e.target.value)}
                    min="0"
                  />
                </label>
                <button type="button" className="dev-danger-button" onClick={removeDevFlightMiles}>마일리지 삭제</button>

                <div className="dev-total-mileage-box">
                  <b>누적 마일리지 조절</b>
                  <small>등급 해금은 이 누적 획득 마일리지 기준으로 계산됩니다.</small>
                  <label>
                    누적 마일리지 추가/삭제 단위
                    <input
                      type="number"
                      value={devTotalMileageAmount}
                      onChange={(e) => setDevTotalMileageAmount(e.target.value)}
                      min="0"
                    />
                  </label>
                  <div className="dev-mileage-actions">
                    <button type="button" onClick={addDevTotalFlightMiles}>누적 +</button>
                    <button type="button" className="dev-danger-button" onClick={removeDevTotalFlightMiles}>누적 -</button>
                  </div>
                  <label>
                    누적 마일리지 직접 설정
                    <input
                      type="number"
                      value={devTotalMileageSetValue}
                      onChange={(e) => setDevTotalMileageSetValue(e.target.value)}
                      min="0"
                      placeholder={String(totalFlightMilesEarned)}
                    />
                  </label>
                  <button type="button" onClick={setDevTotalFlightMiles}>누적 마일리지 설정</button>
                  <em>현재 누적: {totalFlightMilesEarned.toLocaleString()}M · 현재 등급: {stdrAirTier.current.label}</em>
                </div>

                <div className="dev-stamp-row">
                  <select value={devStampFromCode} onChange={(e) => setDevStampFromCode(e.target.value)}>
                    {FLIGHT_COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>{country.code} · {country.name}</option>
                    ))}
                  </select>
                  <span>→</span>
                  <select value={devStampToCode} onChange={(e) => setDevStampToCode(e.target.value)}>
                    {FLIGHT_COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>{country.code} · {country.name}</option>
                    ))}
                  </select>
                </div>
                <button type="button" onClick={addDevPassportStamp}>선택 국가 도장 찍기</button>

                <label>
                  스탬프 삭제
                  <select
                    value={devDeleteStampId || passportStamps[0]?.id || ""}
                    onChange={(e) => setDevDeleteStampId(e.target.value)}
                    disabled={!passportStamps.length}
                  >
                    {!passportStamps.length ? (
                      <option value="">삭제할 스탬프 없음</option>
                    ) : (
                      passportStamps.map((stamp) => (
                        <option key={stamp.id} value={stamp.id}>
                          {stamp.date} · {stamp.fromCode} → {stamp.toCode}
                        </option>
                      ))
                    )}
                  </select>
                </label>
                <button
                  type="button"
                  className="dev-danger-button"
                  onClick={deleteDevPassportStamp}
                  disabled={!passportStamps.length}
                >
                  선택 스탬프 삭제
                </button>
              </div>

              <p>
                이 기능은 Firebase 시간을 바꾸지 않고, 화면의 비행기 위치와 IN-FLIGHT STATUS 진행률만 빠르게 테스트합니다.
              </p>
            </div>
          )}
        </div>
      )}

      {flightFullscreenOpen && flightFeatureOpen && (
        <div className="flight-fullscreen">
          <div className="flight-fullscreen-top">
            <div>
              <div className="flight-kicker">FLIGHT FOCUS SCREEN</div>
              <h2>비행기 집중 화면</h2>
            </div>
            <button type="button" onClick={() => setFlightFullscreenOpen(false)}>
              전체화면 닫기
            </button>
          </div>
          <div className="flight-fullscreen-grid">
            <div className="flight-fullscreen-map">
              {renderFlightModeUi()}
            </div>
            {renderFlightFullscreenSummary()}
          </div>
        </div>
      )}

      {unlockListOpen && (
        <div
          className="unlock-list-overlay"
          onWheel={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
        >
          <div
            className="unlock-list-modal"
            onWheel={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            <div className="unlock-list-head">
              <div>
                <span>FLIGHT UNLOCK</span>
                <h2>해금 가능한 모든 나라</h2>
                <p>보유 마일리지 {flightMiles.toLocaleString()}M · 잠긴 나라는 마일리지로 여행을 열 수 있어요.</p>
              </div>
              <button type="button" onClick={() => setUnlockListOpen(false)}>×</button>
            </div>

            <div className="unlock-list-grid">
              {FLIGHT_COUNTRIES
                .filter((country) => !isFlightCountryUnlocked(country.code))
                .map((country) => {
                  const cost = flightUnlockCost(country);
                  const enough = flightMiles >= cost;

                  return (
                    <div key={country.code} className="unlock-country-card">
                      <div>
                        <b>{country.code}</b>
                        <span>{country.name}</span>
                        <small>{country.city}</small>
                      </div>
                      <strong>{cost}M</strong>
                      <button
                        type="button"
                        disabled={!enough}
                        onClick={() => unlockFlightCountry(country)}
                      >
                        {enough ? "해금" : "마일 부족"}
                      </button>
                    </div>
                  );
                })}

              {!FLIGHT_COUNTRIES.some((country) => !isFlightCountryUnlocked(country.code)) && (
                <div className="unlock-empty-card">
                  모든 나라를 해금했습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tierPreviewOpen && (
        <div className="tier-preview-overlay">
          <div className="tier-preview-modal">
            <div className="tier-preview-head">
              <div>
                <span>STDR AIR CLASS PREVIEW</span>
                <h2>등급별 디자인 미리보기</h2>
                <p>등급과 테마는 사용 후 남은 마일이 아니라 누적 획득 마일리지 기준으로 해금됩니다. 공부량이 쌓일수록 여권, 탑승권, 비행기 색상, 도착 보상 화면과 앱 테마 색상이 함께 해금됩니다.</p>
                <div className="stdr-theme-unlock-strip">
                  {STDR_AIR_TIERS.map((tier) => {
                    const unlocked = totalFlightMilesEarned >= tier.threshold;
                    const active = selectedStdrThemeId === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        disabled={!unlocked}
                        className={active ? "active" : ""}
                        onClick={() => changeStdrTheme(tier.id)}
                        style={{
                          "--stdr-tier-accent": tier.accent,
                          "--stdr-tier-accent-2": tier.accent2,
                        }}
                      >
                        <i />
                        <span>{tier.label}</span>
                        <small>{unlocked ? "해금" : `${tier.threshold.toLocaleString()}M`}</small>
                      </button>
                    );
                  })}
                </div>
              </div>
              <button type="button" onClick={() => setTierPreviewOpen(false)}>×</button>
            </div>

            <div className="tier-preview-grid">
              {STDR_AIR_TIERS.map((tier) => {
                const unlocked = totalFlightMilesEarned >= tier.threshold;
                const nextTarget = tier.threshold - totalFlightMilesEarned;

                return (
                  <div
                    key={tier.id}
                    className={`tier-preview-card stdr-tier-${tier.id} ${unlocked ? "unlocked" : "locked"}`}
                    style={{
                      "--stdr-tier-accent": tier.accent,
                      "--stdr-tier-accent-2": tier.accent2,
                      "--stdr-plane-color": tier.plane,
                      "--stdr-stamp-color": tier.stamp || tier.accent,
                      "--stdr-ticket-bg": tier.ticketBg,
                      "--stdr-ticket-text": tier.ticketText,
                      "--stdr-passport-bg": tier.passportBg,
                      "--stdr-reward-bg": tier.rewardBg,
                    }}
                  >
                    <div className="tier-preview-title">
                      <span>{unlocked ? "해금됨" : `${Math.max(0, nextTarget).toLocaleString()}M 필요`}</span>
                      <h3>{tier.label}</h3>
                      <small>STDR Air {tier.korean} · 누적 {tier.threshold.toLocaleString()}M 필요</small>
                    </div>

                    <div className={`flight-ticket tier-preview-ticket-mock stdr-tier-${tier.id}`}>
                      <div className="flight-ticket-main">
                        <span>STDR AIR · {tier.label}</span>
                        <h2>KR → JP</h2>
                        <p>대한민국 서울 출발 · 일본 도쿄 도착</p>
                        <div className="flight-ticket-row">
                          <div>
                            <small>CLASS</small>
                            <b>{tier.label}</b>
                          </div>
                          <div>
                            <small>TIME</small>
                            <b>1H 20M</b>
                          </div>
                        </div>
                      </div>
                      <div className="flight-ticket-stub">
                        <span>GATE</span>
                        <b>{tier.badge}</b>
                        <small>KRJP</small>
                      </div>
                    </div>

                    <div className="tier-preview-middle">
                      <div className={`tier-preview-passport passport-preview-mock stdr-tier-${tier.id}`}>
                        <span>STDR AIR PASSPORT</span>
                        <b>{tier.badge}</b>
                        <small>{tier.label} Passport</small>
                        <em>{tier.label}</em>
                      </div>
                      <div className="tier-preview-plane">
                        <span className="tier-preview-plane-icon">✈</span>
                        <small>실제 지도 비행기 색상</small>
                      </div>
                    </div>

                    <div className="tier-preview-reward arrival-preview-mock">
                      <span>ARRIVAL REWARD</span>
                      <b>{tier.label} 도착 보상</b>
                      <small>도장 · 마일리지 · 등급 진행률</small>
                      <em>{tier.badge} STAMP</em>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {passportOpen && (
        <div className="passport-page-overlay">
          <div className="passport-page-shell">
            <div className="passport-page-top">
              <div>
                <span>STUDY AIR PASSPORT</span>
                <h2>나의 비행 여권</h2>
              </div>
              <button type="button" onClick={() => setPassportOpen(false)}>×</button>
            </div>

            <div className="passport-book-layout">
              <button
                type="button"
                className="passport-page-nav"
                disabled={passportPage <= 0}
                onClick={() => setPassportPage((page) => Math.max(0, page - 1))}
              >
                ‹
              </button>

              <div
                className={`passport-paper-page stdr-tier-${selectedStdrThemeId}`}
                key={passportPage}
                style={{
                  "--stdr-tier-accent": selectedStdrThemeStyle.accent,
                  "--stdr-tier-accent-2": selectedStdrThemeStyle.accent2,
                  "--stdr-passport-bg": selectedStdrThemeStyle.passportBg,
                  "--stdr-stamp-color": selectedStdrThemeStyle.stamp || selectedStdrThemeStyle.accent,
                  "--stdr-ticket-text": selectedStdrThemeStyle.ticketText,
                }}
              >
                {passportPage === 0 ? (
                  <div className="passport-cover-page">
                    <div className="passport-emblem">STDR</div>
                    <h3>STDR Air Passport</h3>
                    <p>비행 집중 공부를 완료하면 도착 국가의 스탬프와 항공사 등급 마일이 쌓입니다.</p>
                    <div className="passport-cover-stats">
                      <div><span>항공사 등급</span><b>{stdrAirTier.current.label}</b></div>
                      <div><span>누적 마일</span><b>{totalFlightMilesEarned.toLocaleString()}M</b></div>
                      <div><span>보유 마일</span><b>{flightMiles.toLocaleString()}M</b></div>
                      <div><span>총 스탬프</span><b>{passportStamps.length}</b></div>
                      <div><span>국가 수</span><b>{getPassportStats().length}</b></div>
                      <div><span>다음 등급</span><b>{stdrAirTier.next ? `${stdrAirTier.next.label}` : "MAX"}</b></div>
                    </div>
                  </div>
                ) : (
                  <div className="passport-stamp-page">
                    <div className="passport-page-label">PAGE {passportPage}</div>
                    <div className="passport-page-grid">
                      {passportStamps.slice((passportPage - 1) * 6, passportPage * 6).map((stamp) => (
                        <div className="passport-page-stamp" key={stamp.id}>
                          <span>{stamp.toName || stamp.toCode}</span>
                          <b>{stamp.fromCode} → {stamp.toCode}</b>
                          <small>{stamp.date} · {stamp.landedAt}</small>
                        </div>
                      ))}
                      {passportStamps.slice((passportPage - 1) * 6, passportPage * 6).length === 0 && (
                        <p className="passport-empty-page">이 페이지에는 아직 스탬프가 없습니다.</p>
                      )}
                    </div>
                    <div className="passport-country-stats">
                      {getPassportStats().slice(0, 8).map((stat) => (
                        <span key={stat.code}>{stat.name} {stat.count}개</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="passport-page-nav"
                disabled={passportPage >= Math.max(0, Math.ceil(passportStamps.length / 6))}
                onClick={() => setPassportPage((page) => Math.min(Math.ceil(passportStamps.length / 6), page + 1))}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      {arrivalReward && (
        <div className="arrival-reward-overlay">
          <div
            className={`arrival-reward-card stdr-tier-${arrivalReward.airlineTier?.id || stdrAirTier.current.id}`}
            style={{
              "--stdr-tier-accent": getStdrTierStyle(arrivalReward.airlineTier || stdrAirTier.current).accent,
              "--stdr-tier-accent-2": getStdrTierStyle(arrivalReward.airlineTier || stdrAirTier.current).accent2,
              "--stdr-stamp-color": getStdrTierStyle(arrivalReward.airlineTier || stdrAirTier.current).stamp || getStdrTierStyle(arrivalReward.airlineTier || stdrAirTier.current).accent,
              "--stdr-reward-bg": getStdrTierStyle(arrivalReward.airlineTier || stdrAirTier.current).rewardBg,
              "--stdr-ticket-text": getStdrTierStyle(arrivalReward.airlineTier || stdrAirTier.current).ticketText,
            }}
          >
            <button type="button" className="arrival-close" onClick={() => setArrivalReward(null)}>×</button>
            <div className="arrival-kicker">ARRIVAL REWARD</div>
            <h2>{arrivalReward.title}</h2>
            <p>
              {arrivalReward.from?.name || "출발지"}에서 {arrivalReward.to?.name || "도착지"}까지의 비행 집중 공부를 완료했습니다.
            </p>
            <div className="arrival-stamp">
              <span>PASSPORT STAMP</span>
              <b>{arrivalReward.from?.code} → {arrivalReward.to?.code}</b>
              <small>{arrivalReward.to?.city} 착륙</small>
            </div>
            <div className="arrival-airline-tier">
              <span>STDR AIR CLASS</span>
              <b>{arrivalReward.airlineTier?.label || stdrAirTier.current.label}</b>
              <small>
                누적 {(arrivalReward.totalFlightMilesEarned ?? totalFlightMilesEarned).toLocaleString()}M
                {arrivalReward.nextAirlineTier ? ` · 다음 ${arrivalReward.nextAirlineTier.label}` : " · 최고 등급"}
              </small>
              <div className="stdr-tier-progress">
                <i style={{ width: `${arrivalReward.airlineTierProgress ?? stdrAirTier.progress}%` }} />
              </div>
            </div>
            <div className="arrival-reward-grid">
              <div><span>획득 마일</span><b>+{arrivalReward.milesEarned}M</b></div>
              <div><span>보유 마일</span><b>{arrivalReward.totalMiles.toLocaleString()}M</b></div>
              <div><span>공부 시간</span><b>{formatStudy(arrivalReward.seconds)}</b></div>
              <div><span>여권 스탬프</span><b>{arrivalReward.stampCount}개</b></div>
            </div>
          </div>
        </div>
      )}

      {weatherToast && (
        <div
          style={{
            position: "fixed",
            top: easyLayout ? 12 : 18,
            right: easyLayout ? 10 : 18,
            left: easyLayout ? 10 : "auto",
            zIndex: 80,
            maxWidth: easyLayout ? "none" : 360,
            padding: "12px 14px",
            borderRadius: 18,
            background: "rgba(25,31,40,0.94)",
            color: "white",
            boxShadow: "0 18px 42px rgba(0,0,0,0.22)",
            fontSize: 13,
            fontWeight: 850,
            lineHeight: 1.45,
          }}
        >
          {weatherToast}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: easyLayout ? "1fr" : "58px minmax(0, 1fr)",
          minHeight: "100vh",
          background: "var(--app-bg)",
        }}
      >
        {!easyLayout && (
          <aside
            style={{
              borderRight: "1px solid var(--border-soft)",
              background: "var(--card-bg-solid)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              padding: "14px 0",
              position: "sticky",
              top: 0,
              alignSelf: "start",
              height: "100vh",
              zIndex: 40,
              boxSizing: "border-box",
            }}
          >
            <button
              title="내 정보"
              onClick={openProfile}
              style={{
                width: 42,
                height: 42,
                border: darkMode ? "1px solid rgba(96,165,250,0.28)" : "none",
                borderRadius: 16,
                background: darkMode ? "rgba(30,41,59,0.86)" : "#f2f6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
                boxShadow: darkMode ? "0 8px 20px rgba(0,0,0,0.24)" : "0 8px 18px rgba(49,130,246,0.12)",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <NavSvgIcon type="profile" dark={darkMode} size={27} />
            </button>
            {[
              { label: "홈", type: "home" },
              { label: "방", type: "room" },
              { label: "플래너", type: "planner" },
              { label: "채팅", type: "chat" },
            ].map((item, idx) => (
              <button
                key={item.label}
                title={item.label}
                onClick={() => {
                  if (item.label === "방") setRoomMenuOpen(true);
                  if (item.label === "플래너") setPlannerOpen(true);
                  if (item.label === "채팅") setChatOpen(true);
                }}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 16,
                  background: idx === 0
                    ? (darkMode ? "linear-gradient(135deg, var(--accent), var(--accent-dark))" : "#edf4ff")
                    : (darkMode ? "rgba(15,23,42,0.34)" : "transparent"),
                  border: darkMode ? "1px solid rgba(96,165,250,0.18)" : "none",
                  boxShadow: idx === 0 && darkMode ? "0 10px 24px rgba(37,99,235,0.22)" : "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                <NavSvgIcon type={item.type} active={idx === 0 && darkMode} dark={darkMode} size={26} />
              </button>
            ))}
          </aside>
        )}

        <div style={{ ...S.wrap, padding: easyLayout ? "10px 10px 92px" : "10px 18px 18px" }}>
          <div
            style={{
              minHeight: 44,
              height: easyLayout ? "auto" : 44,
              display: "flex",
              alignItems: easyLayout ? "flex-start" : "center",
              justifyContent: "space-between",
              gap: easyLayout ? 8 : 12,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <StudyRoomLogo dark={darkMode} size={34} />
                <h1
                  style={{
                    margin: 0,
                    fontSize: 18,
                    letterSpacing: -0.4,
                    color: "var(--text-main)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Study Room
                </h1>
              </div>
              <div
                style={{
                  height: 28,
                  padding: "0 10px",
                  borderRadius: 999,
                  background: "var(--card-bg-solid)",
                  border: "1px solid var(--border-soft)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "var(--text-sub)",
                  fontSize: 12,
                  minWidth: 0,
                }}
              >
                <span style={{ color: "var(--accent)", fontWeight: 900 }}>●</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {currentGroup?.name || "입장한 방 없음"}
                </span>
              </div>
            </div>

            <div style={{ display: isCompactScreen && mobileTab !== "home" ? "none" : "flex", alignItems: "center", gap: 8, width: easyLayout ? "100%" : "auto", flexWrap: "wrap" }}>
              {renderTopModeControls()}
              <select
                style={{ ...S.input, flex: easyLayout ? 1 : "0 0 auto", width: easyLayout ? "auto" : 190, height: 38, padding: "7px 10px" }}
                value={selectedDdayId}
                onChange={(e) => {
                  setSelectedDdayId(e.target.value);
                  setPlannerDdayId(e.target.value);
                }}
              >
                <option value="">D-DAY 없음</option>
                {ddays.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} · {formatDday(d.date)}
                  </option>
                ))}
              </select>
              <button style={{ ...S.lightButton, height: 38, padding: "7px 10px", flex: "0 0 auto" }} onClick={openNewDday}>
                D-DAY
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: easyLayout ? "1fr" : "minmax(0, 1fr) 320px",
              gap: easyLayout ? 10 : 14,
              alignItems: "start",
            }}
          >
            <main style={{ minWidth: 0, display: easyLayout ? "none" : "block" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: easyLayout
                    ? "repeat(2, minmax(0, 1fr))"
                    : "repeat(4, minmax(150px, 1fr))",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                {[
                  ["오늘 총 공부", formatTimer(todayTotalWithLive), studying ? "진행 중 포함" : "저장된 기록 기준", "var(--accent)"],
                  ["현재 과목", subject, formatTimer(currentSessionSeconds), "#00a661"],
                  ["과목 오늘 누적", formatStudy(currentSubjectTodayTotal), subject, "#8b5cf6"],
                  ["그룹 오늘 합계", formatTimer(groupTodayTotal), currentGroup?.name || "방 없음", "#f97316"],
                ]
                  .filter(([title]) => !(easyLayout && title === "그룹 오늘 합계"))
                  .map(([title, value, desc, color]) => (
                  <div
                    key={title}
                    style={{
                      ...S.card,
                      padding: easyLayout ? "11px 11px" : "13px 14px",
                      minHeight: easyLayout ? 82 : 92,
                      border: "1px solid var(--border-soft)",
                    }}
                  >
                    <div style={{ ...S.small, fontWeight: 900 }}>{title}</div>
                    <div
                      style={{
                        fontSize: easyLayout ? (title === "현재 과목" ? 18 : 20) : (title === "현재 과목" ? 24 : 26),
                        fontWeight: 950,
                        letterSpacing: -1,
                        marginTop: 8,
                        color: "var(--text-main)",
                        lineHeight: 1.05,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {value}
                    </div>
                    <div style={{ ...S.small, marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: color, display: "inline-block" }} />
                      {desc}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className={flightFeatureOpen ? "flight-feature-shell open" : "flight-feature-shell closed"}
                aria-hidden={!flightFeatureOpen}
              >
                {renderFlightModeUi()}
              </div>


              

              <section
                style={{
                  ...S.card,
                  padding: 14,
                  marginBottom: 12,
                  background: darkMode ? "linear-gradient(180deg, rgba(15,23,42,0.96) 0%, rgba(17,24,39,0.94) 100%)" : "linear-gradient(180deg, #ffffff 0%, #fbfcfd 100%)",
                  border: "1px solid var(--border-soft)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: easyLayout ? "flex-start" : "center",
                    gap: 12,
                    marginBottom: 12,
                    flexDirection: easyLayout ? "column" : "row",
                  }}
                >
                  <div>
                    <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>실시간 순공 측정</div>
                    <h2 style={{ margin: "2px 0 0", fontSize: 24, letterSpacing: -0.8 }}>
                      {studying ? `${subject} 공부 중` : "오늘 시작하기"}
                    </h2>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: easyLayout ? 38 : 42, fontWeight: 950, letterSpacing: -1.4, lineHeight: 1 }}>
                      {formatTimer(currentSessionSeconds)}
                    </div>
                    <div style={{ ...S.small, marginTop: 4 }}>
                      {studying ? `${startedAt}부터 측정 중` : "대기 중"}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: easyLayout ? "1fr" : "minmax(0, 0.88fr) minmax(0, 1.12fr)",
                    gap: 12,
                    alignItems: "stretch",
                  }}
                >
                  <div
                    style={{
                      background: "var(--app-bg)",
                      border: "1px solid var(--border-soft)",
                      borderRadius: 18,
                      padding: 12,
                    }}
                  >
                    <div style={S.grid2}>
                      <Field label="과목 선택">
                        <div style={{ position: "relative" }}>
                          <button
                            type="button"
                            disabled={studying}
                            onClick={() => setSubjectPickerOpen((v) => !v)}
                            style={{
                              ...S.input,
                              width: "100%",
                              textAlign: "left",
                              cursor: studying ? "not-allowed" : "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 8,
                            }}
                          >
                            <span>{subject}</span>
                            <span style={{ color: "var(--text-sub)", fontWeight: 900 }}>
                              {subjectPickerOpen ? "⌃" : "⌄"}
                            </span>
                          </button>

                          {subjectPickerOpen && !studying && (
                            <div
                              style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                top: "calc(100% + 6px)",
                                zIndex: 45,
                                display: "grid",
                                gap: 4,
                                maxHeight: 230,
                                overflowY: "auto",
                                padding: 6,
                                borderRadius: 16,
                                background: "var(--card-bg-solid)",
                                border: "1px solid var(--border-soft)",
                                boxShadow: "0 18px 42px rgba(25,31,40,0.16)",
                              }}
                            >
                              {subjects.map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => {
                                    setSubject(s);
                                    setSubjectPickerOpen(false);
                                  }}
                                  style={{
                                    border: "none",
                                    borderRadius: 12,
                                    padding: "9px 10px",
                                    textAlign: "left",
                                    cursor: "pointer",
                                    fontWeight: 850,
                                    background: subject === s ? "var(--accent-soft)" : "transparent",
                                    color: subject === s ? "var(--accent-text)" : "var(--text-main)",
                                  }}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </Field>

                      <Field label="과목 추가">
                        <div style={{ display: "flex", gap: 6 }}>
                          <input
                            style={S.input}
                            value={newSubject}
                            disabled={studying}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder="예 : 미적분"
                          />
                          <button style={{ ...S.lightButton, minWidth: 40 }} onClick={addSubject}>
                            +
                          </button>
                        </div>
                      </Field>
                    </div>

                    <Field label="자세한 공부 내용">
                      <textarea
                        style={{ ...S.textarea, minHeight: easyLayout ? 56 : 70 }}
                        value={detail}
                        disabled={studying}
                        onChange={(e) => setDetail(e.target.value)}
                        placeholder="예 : 영어 단어 Day 12 암기 + 예문 복습"
                      />
                    </Field>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      {studying ? (
                        <button style={{ ...S.button, minWidth: 110 }} onClick={stopStudy}>
                          공부 종료
                        </button>
                      ) : (
                        <button
                          style={{ ...S.button, minWidth: 110 }}
                          disabled={!subject || !detail.trim()}
                          onClick={startStudy}
                        >
                          순공 시작
                        </button>
                      )}
                      <div style={{ ...S.small, lineHeight: 1.4 }}>
                        친구에게 표시: <b style={{ color: "var(--text-main)" }}>{subject}</b> · {detail}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "var(--card-bg-solid)",
                      border: "1px solid var(--border-soft)",
                      borderRadius: 18,
                      padding: 12,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <div>
                        <div style={{ ...S.small, fontWeight: 900 }}>내 스터디 그룹</div>
                        <h3 style={{ margin: "3px 0", fontSize: 17 }}>
                          {currentGroup?.name || selectedGroup?.name || "입장한 방 없음"}
                        </h3>
                        <p style={{ ...S.small, margin: 0 }}>
                          {currentGroup
                            ? `현재 입장 중 · 방 ID ${currentGroup.roomCode}`
                            : selectedGroup
                            ? `선택됨 · 방 ID ${selectedGroup.roomCode}`
                            : "왼쪽 메뉴의 방 버튼으로 방을 만들거나 입장할 수 있습니다."}
                        </p>
                      </div>
                      <button style={S.lightButton} onClick={() => setRoomMenuOpen(true)}>
                        방 관리
                      </button>
                    </div>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: 10 }}>
                      <select
                        style={{ ...S.input, flex: "1 1 150px", minWidth: 0 }}
                        value={selectedGroupId}
                        onChange={(e) => setSelectedGroupId(e.target.value)}
                        disabled={studying}
                      >
                        <option value="">방 선택</option>
                        {groups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                      <button
                        style={S.button}
                        disabled={!selectedGroup || studying}
                        onClick={() => setEnteredGroupId(selectedGroup.id)}
                      >
                        입장
                      </button>
                      {selectedGroup?.ownerUid === uid && (
                        <button
                          className="danger-action-button"
                          style={{ ...S.lightButton, color: "#dc2626", borderColor: "#fecaca", background: darkMode ? "rgba(127,29,29,0.28)" : "#fff1f2" }}
                          disabled={studying}
                          onClick={() => deleteGroup(selectedGroup)}
                        >
                          삭제
                        </button>
                      )}
                    </div>

                    {(currentGroup || selectedGroup) && (
                      <div
                        style={{
                          marginTop: 10,
                          display: "grid",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            background: "var(--input-bg)",
                            border: "1px solid var(--border)",
                            borderRadius: 14,
                            padding: 10,
                          }}
                        >
                          <b style={{ display: "block", fontSize: 12, color: "var(--text-mid)" }}>방 설명</b>
                          <p style={{ ...S.small, margin: "4px 0 0", lineHeight: 1.45 }}>
                            {(currentGroup || selectedGroup)?.description || "아직 방 설명이 없습니다."}
                          </p>
                        </div>
                        <div
                          style={{
                            background: "var(--input-bg)",
                            border: "1px solid var(--border)",
                            borderRadius: 14,
                            padding: 10,
                          }}
                        >
                          <b style={{ display: "block", fontSize: 12, color: "var(--text-mid)" }}>방 목표</b>
                          <p style={{ ...S.small, margin: "4px 0 0", lineHeight: 1.45 }}>
                            {(currentGroup || selectedGroup)?.goal || "아직 방 목표가 없습니다."}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedGroup?.ownerUid === uid && (
                      <div
                        className=""
                        style={{
                          marginTop: 10,
                          padding: "10px 12px",
                          borderRadius: 18,
                          background: darkMode
                            ? "linear-gradient(135deg, rgba(30,41,59,0.96), rgba(15,23,42,0.92))"
                            : "linear-gradient(135deg, #f8fafc, #ffffff)",
                          border: darkMode ? "1px solid rgba(96,165,250,0.34)" : "1px solid #e2e8f0",
                          boxShadow: darkMode ? "inset 0 0 14px rgba(96,165,250,0.05), 0 0 16px rgba(96,165,250,0.06)" : "0 8px 20px rgba(15,23,42,0.04)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 900, color: "var(--text-main)" }}>
                              방 비밀번호
                            </div>
                            <div style={{ ...S.small, fontSize: 11 }}>
                              방장에게만 보이는 정보입니다.
                            </div>
                          </div>
                          <button
                            type="button"
                            style={{
                              ...S.lightButton,
                              padding: "6px 9px",
                              fontSize: 12,
                              color: darkMode ? "#dbeafe" : "var(--accent)",
                              borderColor: darkMode ? "rgba(96,165,250,0.36)" : "var(--accent-soft-3)",
                              background: darkMode ? "rgba(30,41,59,0.92)" : "var(--accent-soft)",
                            }}
                            onClick={() => setShowRoomPassword((v) => !v)}
                          >
                            {showRoomPassword ? "숨기기" : "확인"}
                          </button>
                        </div>
                        <div
                          style={{
                            marginTop: 8,
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                            fontSize: 18,
                            fontWeight: 900,
                            letterSpacing: 2,
                            color: "var(--text-main)",
                            textShadow: "none",
                          }}
                        >
                          {showRoomPassword ? selectedGroup.password || "저장된 비밀번호 없음" : "••••••••"}
                        </div>
                      </div>
                    )}

                    {selectedGroup?.ownerUid === uid && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-soft)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                          <div>
                            <div style={{ ...S.small, fontWeight: 900 }}>추방 멤버 관리</div>
                            <div style={{ ...S.small, fontSize: 11, marginTop: 3 }}>
                              추방된 멤버는 재입장 허용 전까지 방 ID와 비밀번호를 입력해도 들어올 수 없습니다.
                            </div>
                          </div>
                        </div>

                        <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                          {selectedGroupBannedMembers.length ? (
                            selectedGroupBannedMembers.map((member) => (
                              <div
                                key={member.uid}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: 8,
                                  padding: "8px 10px",
                                  borderRadius: 12,
                                  background: darkMode ? "rgba(255,90,79,0.12)" : "#fff7ed",
                                  border: darkMode ? "1px solid rgba(255,90,79,0.34)" : "1px solid #fed7aa",
                                }}
                              >
                                <div style={{ minWidth: 0 }}>
                                  <b style={{ display: "block", fontSize: 12, color: "#9a3412" }}>
                                    {member.displayName || member.userId || "이름 없음"}
                                  </b>
                                  <span style={{ ...S.small, fontSize: 10 }}>
                                    추방 시간 {member.bannedAtLabel || "정보 없음"}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => allowMemberReentry(selectedGroup, member)}
                                  style={{
                                    ...S.lightButton,
                                    flex: "0 0 auto",
                                    padding: "6px 9px",
                                    fontSize: 11,
                                    color: "var(--accent)",
                                    borderColor: "var(--accent-soft-3)",
                                    background: "var(--accent-soft)",
                                  }}
                                >
                                  재입장 허용
                                </button>
                              </div>
                            ))
                          ) : (
                            <div
                              style={{
                                padding: "8px 10px",
                                borderRadius: 12,
                                background: darkMode ? "rgba(13,30,51,0.72)" : "#f8fafc",
                                border: darkMode ? "1px solid rgba(125,211,252,0.24)" : "1px solid #e2e8f0",
                                ...S.small,
                                fontSize: 11,
                              }}
                            >
                              추방된 멤버가 없습니다.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-soft)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                        <div>
                          <div style={{ ...S.small, fontWeight: 900 }}>백색소음</div>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              marginTop: 4,
                              padding: "4px 8px",
                              borderRadius: 999,
                              fontSize: 11,
                              fontWeight: 900,
                              background: darkMode
                                ? soundPlaying
                                  ? "rgba(96,165,250,0.14)"
                                  : "rgba(13,30,51,0.82)"
                                : soundPlaying
                                ? "#e8f3ff"
                                : "#f2f4f6",
                              color: soundPlaying ? "#1b64da" : "#6b7684",
                            }}
                          >
                            현재 {soundPlaying ? "재생 중" : "정지"}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                          {soundPlaying ? (
                            <button style={S.lightButton} onClick={stopSound}>
                              정지
                            </button>
                          ) : (
                            <button style={S.button} onClick={playSound}>
                              재생
                            </button>
                          )}
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 120px", gap: 8, marginTop: 10, alignItems: "center" }}>
                        <select
                          style={S.input}
                          value={soundType}
                          onChange={(e) => setSoundType(e.target.value)}
                        >
                          {SOUND_OPTIONS.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.label}
                            </option>
                          ))}
                        </select>

                        <div>
                          <div style={{ ...S.small, fontSize: 10, marginBottom: 3 }}>소리 {soundVolume}%</div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={soundVolume}
                            onChange={(e) => setSoundVolume(Number(e.target.value))}
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>

                      <p style={{ ...S.small, margin: "7px 0 0", lineHeight: 1.35 }}>
                        음원이 끝나면 자동으로 반복 재생됩니다.
                        {soundType === "airplane" && (
                          <span style={{ display: "block", marginTop: 3, color: "#f97316", fontWeight: 800 }}>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {!easyLayout && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: 12,
                    alignItems: "stretch",
                  }}
                >
                  <section style={{ minWidth: 0, display: "flex" }}>
                    {renderTodayPlannerCompact(todayRecords, todayTotal, today)}
                  </section>
                </div>
              )}
            </main>

            {renderMobileHomeSection()}

            {easyLayout && mobileTab === "group" && (
              <main
                key={`easy-group-${sectionTransitionKey}`}
                style={{
                  minWidth: 0,
                  display: "grid",
                  gap: 12,
                  animation: "none",
                }}
              >
                <section style={{ ...S.card, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                    <div>
                      <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>그룹</div>
                      <h2 style={{ margin: "4px 0", fontSize: 21 }}>
                        {currentGroup?.name || selectedGroup?.name || "입장한 방 없음"}
                      </h2>
                      <p style={{ ...S.small, margin: 0 }}>
                        {currentGroup
                          ? `현재 입장 중 · 방 ID ${currentGroup.roomCode}`
                          : selectedGroup
                          ? `선택됨 · 방 ID ${selectedGroup.roomCode}`
                          : "아래에서 방을 만들거나 입장할 수 있습니다."}
                      </p>
                    </div>
                    <button
                      type="button"
                      style={{ ...S.lightButton, padding: "8px 10px" }}
                      onClick={() => setChatOpen(true)}
                      disabled={!currentGroup}
                    >
                      채팅
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8, marginTop: 12 }}>
                    <select
                      style={S.input}
                      value={selectedGroupId}
                      onChange={(e) => setSelectedGroupId(e.target.value)}
                      disabled={studying}
                    >
                      <option value="">방 선택</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        style={{ ...S.button, flex: 1 }}
                        disabled={!selectedGroup || studying}
                        onClick={() => setEnteredGroupId(selectedGroup.id)}
                      >
                        입장
                      </button>
                      {selectedGroup?.ownerUid === uid && (
                        <button
                          style={{ ...S.lightButton, flex: 1, color: "#dc2626", borderColor: "#fecaca", background: darkMode ? "rgba(127,29,29,0.28)" : "#fff1f2" }}
                          disabled={studying}
                          onClick={() => deleteGroup(selectedGroup)}
                        >
                          방 삭제
                        </button>
                      )}
                    </div>
                  </div>

                  {selectedGroup?.ownerUid === uid && (
                    <div
                      className=""
                      style={{
                        marginTop: 12,
                        padding: "10px 12px",
                        borderRadius: 18,
                        background: darkMode
                          ? "linear-gradient(135deg, rgba(30,41,59,0.96), rgba(15,23,42,0.92))"
                          : "var(--soft-bg)",
                        border: darkMode ? "1px solid rgba(96,165,250,0.34)" : "1px solid var(--border-soft)",
                        boxShadow: darkMode ? "inset 0 0 14px rgba(96,165,250,0.05), 0 0 16px rgba(96,165,250,0.06)" : "0 8px 20px rgba(15,23,42,0.04)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 900, color: "var(--text-main)" }}>방 비밀번호</div>
                          <div style={{ ...S.small, fontSize: 11 }}>방장에게만 보이는 정보입니다.</div>
                        </div>
                        <button
                          type="button"
                          style={{ ...S.lightButton, padding: "6px 9px", fontSize: 12 }}
                          onClick={() => setShowRoomPassword((v) => !v)}
                        >
                          {showRoomPassword ? "숨기기" : "확인"}
                        </button>
                      </div>
                      <div
                        style={{
                          marginTop: 8,
                          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                          fontSize: 18,
                          fontWeight: 900,
                          letterSpacing: 2,
                          color: "var(--text-main)",
                          textShadow: "none",
                        }}
                      >
                        {showRoomPassword ? selectedGroup.password || "저장된 비밀번호 없음" : "••••••••"}
                      </div>
                    </div>
                  )}

                  {selectedGroup?.ownerUid === uid && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-soft)" }}>
                      <div style={{ ...S.small, fontWeight: 900 }}>추방 멤버 관리</div>
                      <p style={{ ...S.small, fontSize: 11, margin: "4px 0 8px" }}>
                        추방된 멤버는 재입장 허용 전까지 방 ID와 비밀번호를 입력해도 들어올 수 없습니다.
                      </p>
                      <div style={{ display: "grid", gap: 6 }}>
                        {selectedGroupBannedMembers.length ? (
                          selectedGroupBannedMembers.map((member) => (
                            <div
                              key={member.uid}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 10px",
                                borderRadius: 12,
                                background: darkMode ? "rgba(154,52,18,0.25)" : "#fff7ed",
                                border: "1px solid #fed7aa",
                              }}
                            >
                              <div style={{ minWidth: 0 }}>
                                <b style={{ display: "block", fontSize: 12, color: "#9a3412" }}>
                                  {member.displayName || member.userId || "이름 없음"}
                                </b>
                                <span style={{ ...S.small, fontSize: 10 }}>
                                  추방 시간 {member.bannedAtLabel || "정보 없음"}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => allowMemberReentry(selectedGroup, member)}
                                style={{ ...S.lightButton, flex: "0 0 auto", padding: "6px 9px", fontSize: 11, color: "var(--accent)", background: "var(--accent-soft)", borderColor: "var(--accent-soft-3)" }}
                              >
                                재입장 허용
                              </button>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: "8px 10px", borderRadius: 12, background: "var(--soft-bg)", border: "1px solid var(--border-soft)", ...S.small, fontSize: 11 }}>
                            추방된 멤버가 없습니다.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {groupMsg && (
                    <div
                      style={{
                        marginTop: 12,
                        background: "var(--accent-soft)",
                        color: "var(--accent-text)",
                        padding: 10,
                        borderRadius: 14,
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {groupMsg}
                    </div>
                  )}
                </section>

                <section style={{ ...S.card, padding: 16 }}>
                  <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>새 방 만들기</div>
                  <h3 style={{ margin: "4px 0 10px", fontSize: 18 }}>스터디 그룹 생성</h3>

                  <Field label="방 이름">
                    <input
                      style={S.input}
                      value={createRoom.name}
                      onChange={(e) => setCreateRoom((p) => ({ ...p, name: e.target.value }))}
                      placeholder="예: 중간고사 스터디"
                    />
                  </Field>

                  <Field label="방 설명">
                    <input
                      style={S.input}
                      value={createRoom.description}
                      onChange={(e) => setCreateRoom((p) => ({ ...p, description: e.target.value }))}
                      placeholder="같이 공부할 친구들을 초대해 보세요"
                    />
                  </Field>

                  <Field label="방 목표">
                    <input
                      style={S.input}
                      value={createRoom.goal}
                      onChange={(e) => setCreateRoom((p) => ({ ...p, goal: e.target.value }))}
                      placeholder="예: 매일 3시간 이상"
                    />
                  </Field>

                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <button type="button" style={S.lightButton} onClick={generateRoomCode}>
                      ID 생성
                    </button>
                    <span style={{ ...S.small, fontSize: 11 }}>{pendingCode || "방 ID 자동 생성"}</span>
                  </div>
                  <p style={{ ...S.small, marginTop: 0 }}>{codeMsg || "방 ID를 먼저 생성하거나, 만들기 버튼을 누르면 자동 생성됩니다."}</p>

                  <Field label="방 비밀번호">
                    <input
                      style={S.input}
                      value={createRoom.password}
                      onChange={(e) => setCreateRoom((p) => ({ ...p, password: normalizeRoomPw(e.target.value) }))}
                      placeholder="숫자 8개"
                    />
                  </Field>

                  <button type="button" style={{ ...S.button, width: "100%" }} onClick={createGroup}>
                    방 만들기
                  </button>
                </section>

                <section style={{ ...S.card, padding: 16 }}>
                  <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>방 입장</div>
                  <h3 style={{ margin: "4px 0 10px", fontSize: 18 }}>방 ID로 입장</h3>

                  <Field label="방 ID">
                    <input
                      style={S.input}
                      value={joinRoom.code}
                      onChange={(e) => setJoinRoom((p) => ({ ...p, code: normalizeRoomCode(e.target.value) }))}
                      placeholder="예: STUDYABC"
                    />
                  </Field>

                  <Field label="비밀번호">
                    <input
                      style={S.input}
                      value={joinRoom.password}
                      onChange={(e) => setJoinRoom((p) => ({ ...p, password: normalizeRoomPw(e.target.value) }))}
                      placeholder="숫자 8개"
                    />
                  </Field>

                  <button type="button" style={{ ...S.button, width: "100%" }} onClick={joinGroup}>
                    방 입장하기
                  </button>
                </section>

                {renderGroupRankCard()}
              </main>
            )}

            {renderEasyPlannerSection()}

            {renderMobileChatSection()}

            <aside key={`easy-settings-${sectionTransitionKey}`} style={{ display: easyLayout && mobileTab !== "settings" ? "none" : "grid", gap: 12, animation: "none"}}>
              <section style={{ ...S.card, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div>
                    <div style={{ ...S.small, fontWeight: 900 }}>내 정보</div>
                    <h2 style={{ margin: "2px 0", fontSize: 20 }}>{displayName}</h2>
                    <p style={{ ...S.small, margin: 0 }}>@{userId}</p>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {!easyLayout && (
                      <button
                        type="button"
                        style={{
                          ...S.lightButton,
                          background: rightPanelEditOpen ? "var(--accent)" : "var(--input-bg)",
                          color: rightPanelEditOpen ? "white" : "var(--text-main)",
                          padding: "8px 10px",
                        }}
                        onClick={() => setRightPanelEditOpen((v) => !v)}
                      >
                        {rightPanelEditOpen ? "편집 완료" : "패널 편집"}
                      </button>
                    )}
                    <button style={{ ...S.lightButton, padding: "8px 10px" }} onClick={openProfile}>
                      수정
                    </button>
                  </div>
                </div>
              </section>

              {renderChatNoticeSettingsCard()}

              {easyLayout ? (
                renderRightPanelCard("theme")
              ) : (
                <>
                  {rightPanelEditOpen && (
                    <section style={{ ...S.card, padding: 12, border: "1px solid var(--accent-soft-3)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                        <div>
                          <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>오른쪽 패널 편집 중</div>
                          <div style={{ ...S.small, fontSize: 11, marginTop: 2 }}>
                            각 섹션 위의 ↑↓와 삭제 버튼으로 배치를 바꿀 수 있습니다.
                          </div>
                        </div>
                        <button
                          type="button"
                          style={{ ...S.lightButton, padding: "7px 9px", fontSize: 11 }}
                          onClick={resetRightPanelLayout}
                        >
                          초기화
                        </button>
                      </div>

                      {hiddenRightCards.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                          {hiddenRightCards.map((cardId) => (
                            <button
                              key={cardId}
                              type="button"
                              onClick={() => restoreRightPanelCard(cardId)}
                              style={{
                                ...S.lightButton,
                                padding: "6px 8px",
                                fontSize: 11,
                                color: "var(--accent)",
                                background: "var(--accent-soft)",
                                borderColor: "var(--accent-soft-3)",
                              }}
                            >
                              + {RIGHT_PANEL_LABELS[cardId]}
                            </button>
                          ))}
                        </div>
                      )}
                    </section>
                  )}

                  {(flightFeatureOpen
                    ? [
                        "flightTicket",
                        "flightStatus",
                        ...rightPanelOrder.filter((cardId) => cardId !== "flightTicket" && cardId !== "flightStatus"),
                      ]
                    : rightPanelOrder
                  ).map((cardId) => renderRightPanelCard(cardId))}
                </>
              )}

            </aside>
          </div>
        </div>

        {easyLayout && (
          <nav
            className="easy-bottom-nav"
            style={{
              position: "fixed",
              left: easyLayout && !isCompactScreen ? "50%" : 10,
              right: easyLayout && !isCompactScreen ? "auto" : 10,
              bottom: 10,
              transform: easyLayout && !isCompactScreen ? "translateX(-50%)" : "none",
              width: easyLayout && !isCompactScreen ? 520 : "auto",
              maxWidth: "calc(100vw - 20px)",
              zIndex: 70,
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 6,
              padding: 8,
              borderRadius: 24,
              background: darkMode ? "rgba(15,23,42,0.96)" : "rgba(255,255,255,0.96)",
              border: darkMode ? "1px solid rgba(96,165,250,0.30)" : "1px solid var(--border-soft)",
              boxShadow: darkMode ? "0 18px 42px rgba(0,0,0,0.32)" : "0 18px 42px rgba(25,31,40,0.16)",
              backdropFilter: "blur(14px)",
            }}
          >
            {[
              { id: "home", label: "홈", type: "home" },
              { id: "group", label: "그룹", type: "room" },
              { id: "planner", label: "플래너", type: "planner" },
              { id: "chat", label: "채팅", type: "chat" },
              { id: "settings", label: "설정", type: "profile" },
            ].map((item) => {
              const active = mobileTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => switchEasyTab(item.id)}
                  style={{
                    border: darkMode ? "1px solid rgba(96,165,250,0.16)" : "none",
                    background: active
                      ? (darkMode ? "linear-gradient(135deg, var(--accent), var(--accent-dark))" : "var(--accent-soft)")
                      : (darkMode ? "rgba(30,41,59,0.58)" : "transparent"),
                    boxShadow: active
                      ? (darkMode ? "0 10px 24px rgba(37,99,235,0.26)" : "0 8px 20px var(--accent-shadow)")
                      : "none",
                    transform: active ? "translateY(-2px)" : "translateY(0)",
                    padding: "8px 4px",
                    borderRadius: 18,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    color: active
                      ? (darkMode ? "#ffffff" : "var(--accent-text)")
                      : "var(--text-sub)",
                    fontSize: 11,
                    fontWeight: 900,
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 340ms cubic-bezier(0.16, 1, 0.3, 1), color 340ms cubic-bezier(0.16, 1, 0.3, 1), transform 260ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 340ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <NavSvgIcon type={item.type} active={active && darkMode} dark={darkMode} size={25} />
                  <span>{item.label}</span>
                  {item.id === "chat" && unread > 0 && chatNotice && (
                    <span
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 10,
                        minWidth: 18,
                        height: 18,
                        padding: "0 4px",
                        borderRadius: 999,
                        background: "#f59e0b",
                        color: "white",
                        fontSize: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {unread}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {desktopEasyMode && !isCompactScreen && (
          <div
            style={{
              position: "fixed",
              right: 18,
              bottom: 92,
              zIndex: 75,
              display: "flex",
              gap: 6,
              padding: 6,
              borderRadius: 999,
              background: darkMode
                ? "linear-gradient(135deg, rgba(3,10,22,0.92), rgba(13,30,51,0.86))"
                : "rgba(255,255,255,0.92)",
              border: darkMode ? "1px solid rgba(125,211,252,0.34)" : "1px solid var(--border-soft)",
              boxShadow: darkMode ? "0 0 26px rgba(96,165,250,0.14)" : "0 14px 32px rgba(25,31,40,0.18)",
              backdropFilter: "blur(14px)",
            }}
          >
            {(isCompactScreen
              ? [{ id: "easy", label: "쉬운" }]
              : [
                  { id: "advanced", label: "고급" },
                  { id: "easy", label: "쉬운" },
                ]
            ).map((mode) => {
              const active = appMode === mode.id;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => changeAppMode(mode.id)}
                  style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "8px 10px",
                    fontWeight: 950,
                    cursor: "pointer",
                    background: active ? "var(--accent)" : "transparent",
                    color: active ? (darkMode ? "#020617" : "white") : "var(--text-main)",
                  }}
                >
                  {mode.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={toggleFlightFeature}
              style={{
                border: "none",
                borderRadius: 999,
                padding: "8px 10px",
                fontWeight: 950,
                cursor: "pointer",
                background: flightFeatureOpen ? "linear-gradient(135deg, #2563eb, #0ea5e9)" : "transparent",
                color: flightFeatureOpen ? "white" : "var(--text-main)",
                transition: "background 360ms cubic-bezier(0.16, 1, 0.3, 1), color 280ms ease, box-shadow 360ms ease, opacity 260ms ease",
                minWidth: 72,
              }}
            >
              {flightFeatureOpen ? "비행 ON" : "비행 OFF"}
            </button>
          </div>
        )}

        {profileOpen && (
          <Modal title="나의 정보" onClose={() => setProfileOpen(false)}>
            <div
              style={{
                display: "grid",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    background: "var(--soft-bg)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: 16,
                    padding: 10,
                    minWidth: 0,
                  }}
                >
                  <div style={{ ...S.small, fontSize: 11, fontWeight: 900 }}>아이디</div>
                  <div
                    style={{
                      marginTop: 2,
                      fontSize: 15,
                      fontWeight: 950,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {userId}
                  </div>
                </div>

                <div
                  style={{
                    background: "var(--soft-bg)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: 16,
                    padding: 10,
                    minWidth: 0,
                  }}
                >
                  <div style={{ ...S.small, fontSize: 11, fontWeight: 900 }}>표시 이름</div>
                  <div
                    style={{
                      marginTop: 2,
                      fontSize: 15,
                      fontWeight: 950,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {displayName}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 7,
                }}
              >
                <label style={{ display: "grid", gap: 3 }}>
                  <span style={{ ...S.label, marginBottom: 0 }}>표시 이름</span>
                  <input
                    style={{ ...S.input, padding: "8px 10px", borderRadius: 14 }}
                    value={profileForm.displayName}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        displayName: e.target.value.slice(0, 12),
                      }))
                    }
                  />
                </label>

                <label style={{ display: "grid", gap: 3 }}>
                  <span style={{ ...S.label, marginBottom: 0 }}>한 줄 소개</span>
                  <input
                    style={{ ...S.input, padding: "8px 10px", borderRadius: 14 }}
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm((p) => ({ ...p, bio: e.target.value.slice(0, 40) }))
                    }
                  />
                </label>

                <label style={{ display: "grid", gap: 3 }}>
                  <span style={{ ...S.label, marginBottom: 0 }}>기본 공부 목표</span>
                  <input
                    style={{ ...S.input, padding: "8px 10px", borderRadius: 14 }}
                    value={profileForm.defaultGoal}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        defaultGoal: e.target.value.slice(0, 30),
                      }))
                    }
                  />
                </label>
              </div>

              <div
                style={{
                  background: "var(--soft-bg)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: 16,
                  padding: 10,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                  <b style={{ fontSize: 13 }}>비밀번호 변경</b>
                  <span style={{ ...S.small, fontSize: 10 }}>변경하지 않으면 비워두세요.</span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    marginTop: 8,
                  }}
                >
                  <input
                    style={{ ...S.input, padding: "8px 10px", borderRadius: 14 }}
                    type="password"
                    value={profileForm.newPw}
                    onChange={(e) =>
                      setProfileForm((p) => ({ ...p, newPw: normalizePw(e.target.value) }))
                    }
                    placeholder="새 비밀번호"
                  />
                  <input
                    style={{ ...S.input, padding: "8px 10px", borderRadius: 14 }}
                    type="password"
                    value={profileForm.newPw2}
                    onChange={(e) =>
                      setProfileForm((p) => ({ ...p, newPw2: normalizePw(e.target.value) }))
                    }
                    placeholder="다시 입력"
                  />
                </div>
              </div>

              {profileMsg && (
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: 14,
                    background: "var(--accent-soft)",
                    color: "var(--accent-text)",
                    fontSize: 12,
                    fontWeight: 850,
                  }}
                >
                  {profileMsg}
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginTop: 2,
                }}
              >
                <button style={{ ...S.button, padding: "10px 12px" }} onClick={saveProfile}>
                  내 정보 저장
                </button>
                <button style={{ ...S.lightButton, padding: "10px 12px" }} onClick={logout}>
                  로그아웃
                </button>
              </div>
            </div>
          </Modal>
        )}

        {roomMenuOpen && (
          <Modal title="스터디 방 만들기 / 입장" onClose={() => setRoomMenuOpen(false)}>
            <div style={S.grid2}>
              <div style={{ ...S.card, boxShadow: "none" }}>
                <h3 style={{ marginTop: 0 }}>새 방 만들기</h3>
                <p style={S.small}>새 스터디 방을 만들고 친구에게 방 ID와 비밀번호를 알려줄 수 있습니다.</p>
                <button
                  style={{ ...S.button, width: "100%", marginTop: 8 }}
                  onClick={() => {
                    setRoomMenuOpen(false);
                    setCreateOpen(true);
                  }}
                >
                  방 만들기
                </button>
              </div>

              <div style={{ ...S.card, boxShadow: "none" }}>
                <h3 style={{ marginTop: 0 }}>방 ID로 입장</h3>
                <p style={S.small}>친구가 알려준 영어 8자 방 ID와 숫자 8개 비밀번호를 입력해 주세요.</p>

                <Field label="방 ID">
                  <input
                    style={S.input}
                    value={joinRoom.code}
                    onChange={(e) =>
                      setJoinRoom((p) => ({
                        ...p,
                        code: normalizeRoomCode(e.target.value),
                      }))
                    }
                    placeholder="예: STUDYABC"
                  />
                </Field>

                <Field label="비밀번호">
                  <input
                    style={S.input}
                    value={joinRoom.password}
                    onChange={(e) =>
                      setJoinRoom((p) => ({
                        ...p,
                        password: normalizeRoomPw(e.target.value),
                      }))
                    }
                    placeholder="숫자 8개"
                  />
                </Field>

                <button
                  style={{ ...S.button, width: "100%" }}
                  onClick={async () => {
                    await joinGroup();
                    setRoomMenuOpen(false);
                  }}
                >
                  방 입장하기
                </button>
              </div>
            </div>

            {groupMsg && (
              <div
                style={{
                  marginTop: 10,
                  background: "#dcfce7",
                  color: "#166534",
                  padding: 10,
                  borderRadius: 12,
                  fontSize: 12,
                }}
              >
                {groupMsg}
              </div>
            )}
          </Modal>
        )}

        {createOpen && (
          <Modal title="새 스터디 그룹 만들기" onClose={() => setCreateOpen(false)}>
            <p style={S.small}>모든 방은 비공개방으로 생성됩니다.</p>

            <Field label="방 이름">
              <input
                style={S.input}
                value={createRoom.name}
                onChange={(e) =>
                  setCreateRoom((p) => ({ ...p, name: e.target.value }))
                }
              />
            </Field>

            <Field label="방 설명">
              <input
                style={S.input}
                value={createRoom.description}
                onChange={(e) =>
                  setCreateRoom((p) => ({ ...p, description: e.target.value }))
                }
              />
            </Field>

            <Field label="방 목표">
              <input
                style={S.input}
                value={createRoom.goal}
                onChange={(e) =>
                  setCreateRoom((p) => ({ ...p, goal: e.target.value }))
                }
              />
            </Field>

            <div style={{ ...S.card, boxShadow: "none" }}>
              <h3>자동 생성 방 ID</h3>
              <div style={{ fontSize: 34, fontWeight: 900, fontFamily: "monospace" }}>
                {pendingCode || "--------"}
              </div>
              <button style={S.lightButton} onClick={generateRoomCode}>
                ID 생성 / 중복 확인
              </button>
              <p style={S.small}>{codeMsg || "영어 8자 방 ID를 생성해 주세요."}</p>

              <input
                style={S.input}
                value={createRoom.password}
                onChange={(e) =>
                  setCreateRoom((p) => ({
                    ...p,
                    password: normalizeRoomPw(e.target.value),
                  }))
                }
                placeholder="숫자 8개 비밀번호"
              />
            </div>

            <button style={{ ...S.button, width: "100%", marginTop: 12 }} onClick={createGroup}>
              스터디 그룹 만들기
            </button>
          </Modal>
        )}

        {ddayOpen && (
          <Modal title="D-DAY 설정" onClose={() => setDdayOpen(false)}>
            <div style={S.grid2}>
              <div>
                <h3>등록된 D-DAY</h3>
                {ddays.length ? (
                  ddays.map((d) => (
                    <div
                      key={d.id}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: 16,
                        padding: 12,
                        marginBottom: 10,
                      }}
                    >
                      <b>
                        {d.title} {formatDday(d.date)}
                      </b>
                      <p style={S.small}>
                        {d.date} · {d.category} · 중요도 {d.priority}
                      </p>
                      {d.memo && <p style={S.small}>{d.memo}</p>}
                      <button style={S.lightButton} onClick={() => openEditDday(d)}>
                        수정
                      </button>{" "}
                      <button
                        style={S.lightButton}
                        onClick={() => {
                          setSelectedDdayId(d.id);
                          setPlannerDdayId(d.id);
                        }}
                      >
                        대표 선택
                      </button>{" "}
                      <button style={S.lightButton} onClick={() => deleteDday(d.id)}>
                        삭제
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={S.small}>아직 D-DAY가 없습니다.</p>
                )}
              </div>

              <div>
                <h3>{editingDdayId ? "목표 수정" : "새 목표 추가"}</h3>

                <Field label="목표 이름">
                  <input
                    style={S.input}
                    value={ddayForm.title}
                    onChange={(e) =>
                      setDdayForm((p) => ({ ...p, title: e.target.value }))
                    }
                  />
                </Field>

                <Field label="목표 날짜">
                  <input
                    style={S.input}
                    type="date"
                    value={ddayForm.date}
                    onChange={(e) =>
                      setDdayForm((p) => ({ ...p, date: e.target.value }))
                    }
                  />
                </Field>

                <Field label="분류">
                  <select
                    style={S.input}
                    value={ddayForm.category}
                    onChange={(e) =>
                      setDdayForm((p) => ({ ...p, category: e.target.value }))
                    }
                  >
                    <option>시험</option>
                    <option>모의고사</option>
                    <option>수행평가</option>
                    <option>발표</option>
                    <option>과제</option>
                    <option>기타</option>
                  </select>
                </Field>

                <Field label="중요도">
                  <select
                    style={S.input}
                    value={ddayForm.priority}
                    onChange={(e) =>
                      setDdayForm((p) => ({ ...p, priority: e.target.value }))
                    }
                  >
                    <option>낮음</option>
                    <option>보통</option>
                    <option>높음</option>
                  </select>
                </Field>

                <Field label="목표 메모">
                  <textarea
                    style={S.textarea}
                    value={ddayForm.memo}
                    onChange={(e) =>
                      setDdayForm((p) => ({ ...p, memo: e.target.value }))
                    }
                  />
                </Field>

                <button style={{ ...S.button, width: "100%" }} onClick={saveDday}>
                  {editingDdayId ? "수정 저장" : "새 D-DAY 추가"}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {plannerOpen && (
          <Modal title="나의 공부 달력 · 플래너" onClose={() => setPlannerOpen(false)}>
            <div style={S.grid2}>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <button style={S.lightButton} onClick={() => moveMonth(-1)}>
                    이전
                  </button>
                  <b>
                    {calendarMonth.getFullYear()}년 {calendarMonth.getMonth() + 1}월
                  </b>
                  <button style={S.lightButton} onClick={() => moveMonth(1)}>
                    다음
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 6,
                    textAlign: "center",
                    fontSize: 12,
                    color: "#71717a",
                    marginBottom: 6,
                  }}
                >
                  {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
                  {getCalendarCells().map((date, idx) => {
                    const amount = date && recordDateMap[date];
                    const selected = date === plannerDate;

                    return (
                      <button
                        key={idx}
                        disabled={!date}
                        onClick={() => date && setPlannerDate(date)}
                        style={{
                          minHeight: 60,
                          border: "1px solid var(--border)",
                          borderRadius: 14,
                          background: darkMode
                            ? selected
                              ? "rgba(56,213,255,0.22)"
                              : "rgba(13,30,51,0.72)"
                            : selected
                            ? "#18181b"
                            : "white",
                          color: darkMode ? "#eefaff" : selected ? "white" : "#18181b",
                          opacity: date ? 1 : 0,
                          cursor: date ? "pointer" : "default",
                        }}
                      >
                        {date && (
                          <>
                            <b>{Number(date.split("-")[2])}</b>
                            {amount && <div style={{ fontSize: 10 }}>{formatStudy(amount)}</div>}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>{renderPlanner(plannerRecords, plannerTotal, plannerDate)}</div>
            </div>
          </Modal>
        )}

        {chatOpen && (
          <Modal title={currentGroup?.name || "채팅"} onClose={() => setChatOpen(false)}>
            {studying && (
              <div
                style={{
                  background: "#fef3c7",
                  color: "#92400e",
                  padding: 12,
                  borderRadius: 16,
                  marginBottom: 12,
                }}
              >
                순공 측정 중에는 채팅 내용을 볼 수 없습니다.
                {chatNotice && unread > 0 && <div>새 메시지 {unread}개 도착</div>}
              </div>
            )}

            <div
              style={{
                height: 360,
                overflowY: "auto",
                border: "1px solid var(--border)",
                borderRadius: 18,
                padding: 14,
                background: darkMode
                  ? "linear-gradient(135deg, rgba(3,10,22,0.96), rgba(13,30,51,0.86))"
                  : "#f9fafb",
              }}
            >
              {!studying &&
                messages.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      justifyContent: m.senderUid === uid ? "flex-end" : "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "75%",
                        background: darkMode
                          ? m.senderUid === uid
                            ? "linear-gradient(135deg, rgba(96,165,250,0.22), rgba(14,165,233,0.14))"
                            : "rgba(30,41,59,0.86)"
                          : m.senderUid === uid
                          ? "#18181b"
                          : "#e4e4e7",
                        color: darkMode
                          ? "#eefaff"
                          : m.senderUid === uid
                          ? "white"
                          : "#18181b",
                        border: darkMode ? "1px solid rgba(125,211,252,0.24)" : "none",
                        padding: 12,
                        borderRadius: 18,
                        fontSize: 14,
                      }}
                    >
                      <div style={{ fontSize: 11, opacity: 0.7 }}>{m.senderName}</div>
                      {m.text}
                    </div>
                  </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input
                style={S.input}
                value={chatText}
                disabled={studying || !enteredGroupId}
                onChange={(e) => setChatText(e.target.value)}
                onKeyDown={(e) => {
              if (e.key !== "Enter" || e.nativeEvent?.isComposing) return;
              e.preventDefault();
              sendMessage();
            }}
                placeholder={studying ? "순공 중에는 채팅할 수 없습니다" : "메시지를 입력해 주세요"}
              />
              <button style={S.button} disabled={studying || !enteredGroupId || chatSendingRef.current} onClick={sendMessage}>
                전송
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}