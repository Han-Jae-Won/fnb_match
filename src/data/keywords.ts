export const CATEGORIES = ['카페', '바', '와인바', '베이커리', '티하우스', '펍'] as const

export const MENU_TYPES = [
  '스페셜티 커피', '핸드드립', '디저트', '베이커리', '브런치', '티/차',
  '칵테일', '와인', '내추럴 와인', '위스키', '하이볼', '수제맥주', '전통주', '논알콜',
]

export const AROMAS = [
  '플로럴', '시트러스', '베리', '너티', '초콜릿', '캐러멜',
  '바닐라', '허브', '우디', '스모키', '스파이시', '오크',
]

export const MOODS = [
  '아늑한', '조용한', '감성적인', '빈티지', '미니멀', '모던',
  '힙한', '활기찬', '레트로', '자연친화', '아지트 같은', '대화하기 좋은',
]

export type TasteKey = 'sweet' | 'acidity' | 'bitter' | 'body' | 'alcohol'

export const TASTE_AXES: { key: TasteKey; label: string; low: string; high: string }[] = [
  { key: 'sweet', label: '단맛', low: '드라이', high: '달콤' },
  { key: 'acidity', label: '산미', low: '부드러움', high: '새콤' },
  { key: 'bitter', label: '쓴맛', low: '순함', high: '쌉쌀' },
  { key: 'body', label: '바디감', low: '가벼움', high: '묵직' },
  { key: 'alcohol', label: '도수', low: '논알콜', high: '강하게' },
]

export type TasteRange = Record<TasteKey, [number, number]>

export const DEFAULT_TASTE: TasteRange = {
  sweet: [20, 70],
  acidity: [20, 70],
  bitter: [20, 70],
  body: [20, 70],
  alcohol: [0, 50],
}

export const AGE_GROUPS = ['20대 초반', '20대 후반', '30대', '40대', '50대 이상']
export const REGIONS = ['성수', '연남·망원', '을지로·종로', '한남·이태원', '서촌·북촌', '문래·영등포']
