import type { TasteRange } from './keywords'

export interface Store {
  id: string
  name: string
  category: string
  area: string
  distanceKm: number
  address: string
  hours: string
  intro: string
  photos: string[]
  menuTypes: string[]
  signature: string
  taste: TasteRange
  aromas: string[]
  moods: string[]
  ownerName: string
  phone: string
  instagram: string
  isMine?: boolean
  draft?: boolean
}

export const u = (id: string) => `./img/${id}.jpg`

export const DUMMY_STORES: Store[] = [
  {
    id: 'ondo',
    name: '온도 커피랩',
    category: '카페',
    area: '성수',
    distanceKm: 0.8,
    address: '서울 성동구 성수이로 7길 12',
    hours: '매일 10:00 – 21:00',
    intro: '산지별 싱글오리진을 직접 로스팅합니다. 꽃향 가득한 에티오피아 핸드드립이 자랑이에요.',
    photos: [u('1501339847302-ac426a4a7cbb'), u('1442512595331-e89e73853f31'), u('1495474472287-4d71bcdd2085')],
    menuTypes: ['스페셜티 커피', '핸드드립', '디저트'],
    signature: '예가체프 핸드드립',
    taste: { sweet: [20, 50], acidity: [55, 90], bitter: [10, 40], body: [15, 45], alcohol: [0, 5] },
    aromas: ['플로럴', '시트러스', '베리'],
    moods: ['미니멀', '조용한', '감성적인'],
    ownerName: '김도윤',
    phone: '02-6012-3401',
    instagram: '@ondo.coffeelab',
  },
  {
    id: 'bamseo',
    name: '밤의 서재',
    category: '바',
    area: '을지로',
    distanceKm: 2.4,
    address: '서울 중구 을지로 15길 8, 3층',
    hours: '화–일 19:00 – 02:00',
    intro: '책장 사이에 숨은 위스키 바. 오래된 LP를 틀어두고 조용히 한 잔 하기 좋은 곳입니다.',
    photos: [u('1514933651103-005eec06c04b'), u('1470337458703-46ad1756a187'), u('1543007630-9710e4a00a20')],
    menuTypes: ['위스키', '칵테일', '하이볼'],
    signature: '스모키 올드패션드',
    taste: { sweet: [20, 50], acidity: [5, 30], bitter: [45, 80], body: [60, 95], alcohol: [60, 95] },
    aromas: ['스모키', '우디', '오크', '바닐라'],
    moods: ['빈티지', '아지트 같은', '조용한'],
    ownerName: '박서진',
    phone: '02-2265-0918',
    instagram: '@night.library.bar',
  },
  {
    id: 'berrywood',
    name: '베리 앤 우드',
    category: '와인바',
    area: '한남',
    distanceKm: 3.1,
    address: '서울 용산구 한남대로 20길 31',
    hours: '매일 17:00 – 24:00',
    intro: '내추럴 와인 80여 종과 제철 플레이트. 사장님이 취향을 듣고 한 잔씩 골라드려요.',
    photos: [u('1510812431401-41d2bd2722f3'), u('1506377247377-2a5b3b417ebb'), u('1525268323446-0505b6fe7778')],
    menuTypes: ['내추럴 와인', '와인', '논알콜'],
    signature: '오렌지 와인 플라이트',
    taste: { sweet: [10, 40], acidity: [55, 90], bitter: [15, 45], body: [30, 70], alcohol: [30, 55] },
    aromas: ['베리', '시트러스', '허브', '플로럴'],
    moods: ['감성적인', '대화하기 좋은', '모던'],
    ownerName: '이하은',
    phone: '02-797-5512',
    instagram: '@berry.and.wood',
  },
  {
    id: 'mangwon',
    name: '망원 로스터스',
    category: '카페',
    area: '망원',
    distanceKm: 1.6,
    address: '서울 마포구 포은로 88',
    hours: '매일 08:30 – 20:00',
    intro: '고소하고 묵직한 블렌드로 동네 단골이 많은 로스터리. 아인슈페너가 시그니처입니다.',
    photos: [u('1509042239860-f550ce710b93'), u('1497935586351-b67a49e012bf'), u('1521017432531-fbd92d768814')],
    menuTypes: ['스페셜티 커피', '디저트', '베이커리'],
    signature: '흑당 아인슈페너',
    taste: { sweet: [45, 80], acidity: [5, 35], bitter: [45, 80], body: [55, 90], alcohol: [0, 5] },
    aromas: ['너티', '초콜릿', '캐러멜'],
    moods: ['아늑한', '활기찬', '대화하기 좋은'],
    ownerName: '최민준',
    phone: '02-332-7741',
    instagram: '@mangwon.roasters',
  },
  {
    id: 'ipsae',
    name: '잎새 티하우스',
    category: '티하우스',
    area: '서촌',
    distanceKm: 4.0,
    address: '서울 종로구 자하문로 7길 22',
    hours: '수–월 11:00 – 20:00',
    intro: '한옥 마당이 보이는 찻집. 제주 녹차와 블렌딩 허브티, 계절 화과자를 냅니다.',
    photos: [u('1576092768241-dec231879fc3'), u('1600093463592-8e36ae95ef56'), u('1558961363-fa8fdf82db35')],
    menuTypes: ['티/차', '디저트', '논알콜'],
    signature: '제주 세작 & 유자 양갱',
    taste: { sweet: [15, 50], acidity: [10, 40], bitter: [20, 55], body: [5, 35], alcohol: [0, 5] },
    aromas: ['허브', '플로럴', '시트러스'],
    moods: ['조용한', '자연친화', '감성적인'],
    ownerName: '정유나',
    phone: '02-737-2210',
    instagram: '@ipsae.teahouse',
  },
  {
    id: 'sogeum',
    name: '소금빵 공방',
    category: '베이커리',
    area: '연남',
    distanceKm: 1.9,
    address: '서울 마포구 동교로 41길 5',
    hours: '화–일 09:00 – 19:00 (소진 시 마감)',
    intro: '프랑스산 버터로 매일 아침 굽는 소금빵과 크루아상. 브런치 플레이트도 준비했어요.',
    photos: [u('1555507036-ab1f4038808a'), u('1517433670267-08bbd4be890f'), u('1509440159596-0249088772ff')],
    menuTypes: ['베이커리', '브런치', '스페셜티 커피'],
    signature: '고메버터 소금빵',
    taste: { sweet: [30, 65], acidity: [10, 35], bitter: [10, 40], body: [35, 65], alcohol: [0, 5] },
    aromas: ['너티', '바닐라', '캐러멜'],
    moods: ['아늑한', '자연친화', '활기찬'],
    ownerName: '한지우',
    phone: '02-3144-6630',
    instagram: '@saltbread.atelier',
  },
  {
    id: 'euljihi',
    name: '을지 하이볼 상회',
    category: '펍',
    area: '을지로',
    distanceKm: 2.6,
    address: '서울 중구 수표로 10길 3',
    hours: '월–토 17:00 – 01:00',
    intro: '레트로 간판 아래 생맥주와 하이볼, 그리고 노포 감성 안주. 퇴근길 한 잔 하기 딱이에요.',
    photos: [u('1556679343-c7306c1976bc'), u('1566417713940-fe7c737a9ef2'), u('1572116469696-31de0f17cc34')],
    menuTypes: ['하이볼', '수제맥주', '전통주'],
    signature: '유자 하이볼',
    taste: { sweet: [35, 70], acidity: [35, 70], bitter: [20, 50], body: [20, 50], alcohol: [25, 55] },
    aromas: ['시트러스', '허브', '스파이시'],
    moods: ['레트로', '힙한', '활기찬'],
    ownerName: '오세훈',
    phone: '02-2277-4402',
    instagram: '@euljiro.highball',
  },
  {
    id: 'dessin',
    name: '데생 디저트바',
    category: '카페',
    area: '성수',
    distanceKm: 1.1,
    address: '서울 성동구 연무장길 54',
    hours: '매일 12:00 – 22:00',
    intro: '파티시에가 눈앞에서 완성하는 플레이티드 디저트와 디저트 페어링 칵테일.',
    photos: [u('1559925393-8be0ec4767c8'), u('1544145945-f90425340c7e'), u('1551024709-8f23befc6f87')],
    menuTypes: ['디저트', '칵테일', '스페셜티 커피'],
    signature: '바닐라 밀푀유 & 에스프레소 마티니',
    taste: { sweet: [55, 90], acidity: [20, 55], bitter: [15, 45], body: [30, 60], alcohol: [0, 40] },
    aromas: ['바닐라', '베리', '초콜릿', '플로럴'],
    moods: ['모던', '감성적인', '힙한'],
    ownerName: '윤채원',
    phone: '02-464-0203',
    instagram: '@dessin.dessertbar',
  },
  {
    id: 'mullae',
    name: '문래 브루웍스',
    category: '펍',
    area: '문래',
    distanceKm: 6.2,
    address: '서울 영등포구 도림로 128길 14',
    hours: '화–일 16:00 – 24:00',
    intro: '철공소 골목의 마이크로 브루어리. IPA부터 스타우트까지 직접 양조한 탭 12종.',
    photos: [u('1608270586620-248524c67de9'), u('1535958636474-b021ee887b13')],
    menuTypes: ['수제맥주', '논알콜', '하이볼'],
    signature: '문래 헤이지 IPA',
    taste: { sweet: [15, 45], acidity: [25, 55], bitter: [50, 90], body: [40, 80], alcohol: [35, 65] },
    aromas: ['시트러스', '허브', '초콜릿', '우디'],
    moods: ['힙한', '레트로', '활기찬'],
    ownerName: '강태오',
    phone: '02-2068-1190',
    instagram: '@mullae.brewworks',
  },
]

/** Canned replies the "owner" sends back in chat, keyed by topic. */
export const AUTO_REPLIES: { match: RegExp; reply: (s: Store) => string }[] = [
  { match: /예약|자리|좌석|몇 ?명/, reply: (s) => `네! 원하시는 날짜와 인원 알려주시면 자리 잡아둘게요 😊 (${s.hours})` },
  { match: /메뉴|추천|뭐가|시그니처/, reply: (s) => `처음 오시면 '${s.signature}' 꼭 드셔보세요. 취향 보니 분명 좋아하실 거예요!` },
  { match: /시간|영업|몇 ?시|언제/, reply: (s) => `영업시간은 ${s.hours} 입니다.` },
  { match: /주차|위치|어디|가는/, reply: (s) => `${s.address} 에 있어요. 근처 공영주차장 이용 가능합니다 🚗` },
  { match: /가격|얼마|비싸/, reply: () => '음료는 6천~1만 5천원대예요. 매칭 고객님께는 첫 방문 웰컴 쿠폰 드릴게요 🎁' },
]

export const GENERIC_REPLIES = [
  '말씀 감사해요! 편하실 때 들러주세요 ☕',
  '좋아요 :) 오시면 사장 찾아주세요, 취향에 맞춰 추천해 드릴게요.',
  '그렇군요! 궁금한 거 있으면 언제든 물어봐 주세요.',
]
