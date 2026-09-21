import json
import os
import re

# 1. Load extracted glossary & steps
with open('extracted_glossary.json', 'r', encoding='utf-8') as f:
    raw_glossary = json.load(f)

with open('scraped_all_steps.json', 'r', encoding='utf-8') as f:
    raw_steps = json.load(f)

# Korean terms mapping
glossary_ko_map = {
    'absorption': ('흡수', '피해 1점을 상쇄하는 방어 능력입니다. 접근 흡수(접근 피해 상쇄)와 일제사격 흡수(일제사격 피해 상쇄)의 두 종류가 있으며, 서로 교차 적용되지 않습니다.'),
    'agenda': ('의제 카드', '전략적 목표를 나타내는 카드입니다 (지원, 무력, 번영, 지배 4가지 유형). 선택 단계에서 일치하는 집중 카드와 함께 사용하며, 평가 단계에서 부패가 없는 순수한 의제 카드는 영향력(승점)을 제공합니다.'),
    'approach': ('접근 단계', '전투의 첫 번째 단계입니다. 방어자의 섹터 방어 시설과 성간 기지가 침공자에게 각각 1의 피해를 입힙니다. 항공모함은 이 단계에서 초계함을 전개할 수 있습니다. 접근 피해는 오직 접근 흡수로만 막을 수 있습니다.'),
    'bounty_token': ('현상금 토큰', '특정 공허태생 섹터에 놓여 있는 토큰으로, 해당 섹터를 성공적으로 침공하고 정복했을 때 보상을 제공합니다.'),
    'catastrophe': ('대재앙 토큰', '위기 카드가 위기 보드의 오른쪽 끝을 넘어 밀려났을 때 놓이는 가혹한 페널티 토큰입니다. 각 토큰마다 공허태생의 최종 점수에 20점을 추가하며, 협동/솔로 모드에서 4번째 토큰을 받으면 즉시 패배합니다.'),
    'civilization_track': ('문명 트랙', '3가지 문명 발전 트랙(사회, 국정, 경제)으로 0~4단계로 구성됩니다. 트랙을 전진하면 가문 고유 혜택을 해금하고, 개량 기술 보유 한도를 늘려줍니다. 부패한 트랙은 발전은 가능하지만 혜택을 주지 않습니다.'),
    'clean_up': ('정리 단계', '플레이어 턴의 마지막 단계입니다. 사용한 집중 카드를 버리고, 플레이한 의제 카드를 개인판의 의제 슬롯에 배치합니다.'),
    'combat': ('전투', '함대가 적대적인 섹터(공허태생 또는 다른 플레이어)에 진입했을 때 발생하는 결정론적(주사위 없음) 충돌입니다. 접근 단계와 하나 이상의 일제사격 단계로 구성됩니다.'),
    'combat_card': ('전투 카드', '일부 기술이나 능력이 제공하는 전술 카드로, 전투 중에 추가 화력이나 흡수 능력을 발휘합니다.'),
    'cooperative': ('협동 모드', '플레이어들이 한 팀이 되어 공허태생에 맞서 은하계를 구원하는 게임 모드입니다. 플레이어들은 공동의 위기를 관리하고, 종료 시 공허태생의 점수를 넘어서야 승리합니다.'),
    'corruption': ('부패', '은하계를 집어삼키는 공허태생의 암흑 물질입니다. 개인판의 문명 트랙, 의제 슬롯, 섹터 등에 놓여 기능을 마비시키며, 게임 종료 시 제거되지 않은 부패는 큰 감점을 초래합니다.'),
    'corvette': ('초계함', '가장 기본적이고 민첩한 함선입니다. 기술 개발 없이도 생산 가능하며, 항공모함(Carrier)에 의해 전투 중 즉시 전개될 수 있습니다.'),
    'crisis': ('위기 카드', '협동 및 솔로 모드에서 매 라운드 은하계에 발생하는 위험한 사건들입니다. 해결하지 못하고 방치하면 대재앙 토큰을 발생시킵니다.'),
    'cycle': ('사이클 (라운드)', '게임의 메인 라운드 단위입니다. 보이드폴은 정확히 3번의 사이클로 진행되며, 각 사이클은 준비, 플레이어 턴, 평가 단계로 구성됩니다.'),
    'damage': ('피해', '전투 중 가해지는 타격으로 함대 전투력을 감소시킵니다. 초과된 피해는 섹터 방어 시설이나 시설물을 파괴합니다.'),
    'destroyer': ('구축함', '중형 군함으로, 강력한 일제사격 화력을 제공하며 함대의 주력을 이룹니다.'),
    'dreadnought': ('드레드노트', '가장 거대하고 압도적인 주력 전함입니다. 높은 피해를 견디고 치명적인 일제사격을 가합니다.'),
    'carrier': ('항공모함', '초계함을 탑재하여 접근 단계에서 즉각 투입할 수 있는 전략적 군함입니다.'),
    'evaluation_phase': ('평가 단계', '각 사이클이 끝날 때 진행되는 정산 단계입니다. 유지비 지불, 생산 실행, 은하 목표 및 의제 목표 달성도에 따른 영향력 계산이 이루어집니다.'),
    'fleet_power': ('함대 전투력', '함선 주사위의 눈금으로 표현되는 군사력입니다. 피해를 입으면 주사위 눈금이 줄어들며, 0이 되면 격침됩니다.'),
    'focus_card': ('집중 카드', '각 라운드 플레이어가 사용할 행동을 선택하는 핵심 카드(9장)입니다. 각 카드에는 3개의 행동이 적혀 있으며, 이 중 최대 2개(또는 무역 토큰으로 3개)를 실행합니다.'),
    'galactic_house': ('은하 가문', '플레이어가 선택하여 이끄는 고유한 세력입니다. 각 가문은 고유한 플레이 스타일, 시작 기술, 특수 능력을 보유합니다.'),
    'guild': ('길드', '섹터에 건설할 수 있는 5가지 생산 시설(농업, 에너지, 광업, 과학, 금융)입니다. 각 길드는 해당하는 자원의 생산량을 늘려줍니다.'),
    'influence': ('영향력 (승점)', '보이드폴에서 승리를 결정짓는 최종 승점 화폐입니다. 게임 내 다양한 업적, 섹터 정복, 의제 달성을 통해 획득합니다.'),
    'installation': ('시설물', '섹터에 건설되는 고정 자산으로 성간 기지, 섹터 방어 시설, 우주 조선소, 길드 등이 포함됩니다.'),
    'invade': ('침공', '이동력을 사용하여 적대 세력(공허태생 또는 다른 플레이어)이 있는 섹터로 함대를 진입시켜 전투를 개시하는 행동입니다.'),
    'movement': ('함대 이동', '자신의 섹터 간에 함대를 이동시키거나(재정비), 적대 섹터로 진입(침공)시키는 행동입니다.'),
    'overproduction': ('초과 생산 보너스', '자원 트랙의 최대치(20)를 초과하여 자원을 생산할 때, 초과분 2당 즉시 영향력 1점을 획득하는 보너스 규칙입니다.'),
    'population': ('인구', '섹터의 생산력과 발전 한도를 결정하는 주사위로 표시됩니다. 길드를 건설하려면 적절한 인구가 필요합니다.'),
    'production': ('자원 생산', '평가 단계나 특정 행동 시 보유한 길드와 인구에 따라 식량, 에너지, 재료, 과학, 크레딧을 획득하는 과정입니다.'),
    'pure_sector': ('정화된 섹터', '공허태생의 부패가 완전히 제거되고 아군 문명이 완전히 통제하는 깨끗한 섹터입니다.'),
    'regroup': ('재정비 이동', '전투 없이 안전하게 자신의 섹터들 사이에서 함대 전투력을 재배치하는 평화적 이동입니다.'),
    'salvo': ('일제사격 단계', '전투의 주 단계로, 양측 함대가 동시에 서로에게 화력을 쏟아붓습니다. 사거리와 특수 기술에 따라 먼저 타격할 수도 있습니다.'),
    'sector': ('섹터', '은하 지도를 이루는 육각형(Hex) 구역 단위입니다. 인구, 자원 길드, 방어 시설, 성간 기지가 위치합니다.'),
    'sector_defense': ('섹터 방어 시설', '섹터를 지키는 자동화 방어 포탑으로 접근 단계에서 침공자에게 피해를 입히며 침공 난이도를 높입니다.'),
    'selection': ('선택 단계', '플레이어 턴의 첫 단계로, 손에 든 집중 카드 중 이번 턴에 실행할 카드 1장(및 연계 의제 카드)을 비공개로 선택하는 단계입니다.'),
    'shipyard': ('우주 조선소', '새로운 함대 전투력을 건조하고 전장에 배치할 수 있는 우주 제조 기지입니다.'),
    'solo': ('솔로 모드', '한 명의 플레이어가 인공지능 공허태생 시스템에 맞서 시나리오를 공략하는 1인 전용 게임 모드입니다.'),
    'starbase': ('성간 기지', '섹터의 핵심 군사 거점입니다. 방어 시 접근 피해를 주고, 섹터의 최대 함대 주둔 한도를 늘려줍니다.'),
    'technology': ('기술 카드', '게임 중 연구하여 획득하는 지속 능력 카드입니다. 기본 기술과 더 강력한 개량 기술로 나뉩니다.'),
    'trade': ('무역 토큰', '집중 카드의 3번째 행동을 활성화하거나 자원을 교환하는 데 쓰이는 강력한 특수 자원 토큰입니다.'),
    'upkeep': ('유지비', '각 사이클 평가 단계에서 함대 규모와 문명 유지에 지불해야 하는 식량 및 에너지 비용입니다.'),
    'voidborn': ('공허태생', '은하계 전체를 부패로 잠식하고 파멸로 몰고 가는 주 적대 세력입니다.'),
    'voidstorm': ('공허폭풍', '특정 섹터 간의 이동을 차단하거나 위험하게 만드는 우주적 이상 현상입니다.'),
    'war': ('전쟁 / 적대', '플레이어 간 또는 공허태생과의 전면전을 의미하며 강력한 군사적 충돌을 수반합니다.'),
}

# Build structured glossary
processed_glossary = {}
for term_id, term_data in raw_glossary.items():
    ko_info = glossary_ko_map.get(term_id)
    term_ko = ko_info[0] if ko_info else term_data['term']
    desc_ko = ko_info[1] if ko_info else term_data['definition']
    
    # Process related
    related_list = []
    for rel in term_data.get('related', []):
        r_id = rel['id']
        r_ko = glossary_ko_map[r_id][0] if r_id in glossary_ko_map else rel['term']
        related_list.append({'id': r_id, 'term': r_ko})
        
    processed_glossary[term_id] = {
        'id': term_id,
        'term': term_ko,
        'termEn': term_data['term'],
        'definition': desc_ko,
        'related': related_list
    }

# 2. Layers info definition
layers_info = [
    {
        'index': 0,
        'id': 'layer-0',
        'title': '보이드폴에 오신 것을 환영합니다',
        'titleEn': 'Welcome to Voidfall',
        'stepCount': 4,
        'estimatedMinutes': 3,
        'stepStartIndex': 0,
        'stepEndIndex': 3
    },
    {
        'index': 1,
        'id': 'layer-1',
        'title': '게임은 언제 끝나는가?',
        'titleEn': 'When Does It End?',
        'stepCount': 3,
        'estimatedMinutes': 2,
        'stepStartIndex': 4,
        'stepEndIndex': 6
    },
    {
        'index': 2,
        'id': 'layer-2',
        'title': '점수는 어떻게 획득하는가?',
        'titleEn': 'How Do You Score?',
        'stepCount': 3,
        'estimatedMinutes': 3,
        'stepStartIndex': 7,
        'stepEndIndex': 9
    },
    {
        'index': 3,
        'id': 'layer-3',
        'title': '은하 지도',
        'titleEn': 'The Galaxy Map',
        'stepCount': 4,
        'estimatedMinutes': 4,
        'stepStartIndex': 10,
        'stepEndIndex': 13
    },
    {
        'index': 4,
        'id': 'layer-4',
        'title': '자원과 생산',
        'titleEn': 'Resources and Production',
        'stepCount': 3,
        'estimatedMinutes': 4,
        'stepStartIndex': 14,
        'stepEndIndex': 16
    },
    {
        'index': 5,
        'id': 'layer-5',
        'title': '플레이어 턴 진행',
        'titleEn': 'Your Turn',
        'stepCount': 5,
        'estimatedMinutes': 5,
        'stepStartIndex': 17,
        'stepEndIndex': 21
    },
    {
        'index': 6,
        'id': 'layer-6',
        'title': '함대와 함대 전투력',
        'titleEn': 'Fleets and Fleet Power',
        'stepCount': 4,
        'estimatedMinutes': 4,
        'stepStartIndex': 22,
        'stepEndIndex': 25
    },
    {
        'index': 7,
        'id': 'layer-7',
        'title': '함대 이동과 침공',
        'titleEn': 'Fleet Movement and Invasion',
        'stepCount': 3,
        'estimatedMinutes': 4,
        'stepStartIndex': 26,
        'stepEndIndex': 28
    },
    {
        'index': 8,
        'id': 'layer-8',
        'title': '전투 시스템',
        'titleEn': 'Combat',
        'stepCount': 5,
        'estimatedMinutes': 5,
        'stepStartIndex': 29,
        'stepEndIndex': 33
    },
    {
        'index': 9,
        'id': 'layer-9',
        'title': '침공 결과 및 정복',
        'titleEn': 'Invasion Outcomes',
        'stepCount': 4,
        'estimatedMinutes': 3,
        'stepStartIndex': 34,
        'stepEndIndex': 37
    },
    {
        'index': 10,
        'id': 'layer-10',
        'title': '기술 연구',
        'titleEn': 'Technologies',
        'stepCount': 3,
        'estimatedMinutes': 3,
        'stepStartIndex': 38,
        'stepEndIndex': 40
    },
    {
        'index': 11,
        'id': 'layer-11',
        'title': '의제 카드',
        'titleEn': 'Agendas',
        'stepCount': 3,
        'estimatedMinutes': 3,
        'stepStartIndex': 41,
        'stepEndIndex': 43
    },
    {
        'index': 12,
        'id': 'layer-12',
        'title': '문명 발전 트랙',
        'titleEn': 'Civilization Tracks',
        'stepCount': 3,
        'estimatedMinutes': 3,
        'stepStartIndex': 44,
        'stepEndIndex': 46
    },
    {
        'index': 13,
        'id': 'layer-13',
        'title': '부패 시스템',
        'titleEn': 'Corruption',
        'stepCount': 3,
        'estimatedMinutes': 3,
        'stepStartIndex': 47,
        'stepEndIndex': 49
    },
    {
        'index': 14,
        'id': 'layer-14',
        'title': '평가 단계',
        'titleEn': 'Evaluation Phase',
        'stepCount': 4,
        'estimatedMinutes': 4,
        'stepStartIndex': 50,
        'stepEndIndex': 53
    },
    {
        'index': 15,
        'id': 'layer-15',
        'title': '게임 종료 및 최종 점수',
        'titleEn': 'End of Game Scoring',
        'stepCount': 4,
        'estimatedMinutes': 3,
        'stepStartIndex': 54,
        'stepEndIndex': 57
    }
]

# 3. Process Steps with high quality Korean translations
processed_steps = []

# Title translation map
step_titles_ko = {
    0: '은하 가문의 지도자',
    1: '최종 목표: 영향력(승점)',
    2: '확인: 승리를 결정짓는 화폐는?',
    3: '플레이 방식: 세 가지 모드',
    4: '정확히 세 번의 사이클',
    5: '사이클(라운드)의 구조',
    6: '확인: 게임은 몇 사이클인가요?',
    7: '영향력을 획득하는 다양한 경로',
    8: '경쟁 모드 vs 협동 모드 승리 조건',
    9: '확인: 초과 생산 보너스 규칙',
    10: '섹터: 은하계를 구성하는 기본 단위',
    11: '정화된 섹터 vs 부패한 섹터',
    12: '섹터 인프라와 시설물',
    13: '확인: 모행성 섹터의 안전',
    14: '다섯 가지 핵심 자원',
    15: '생산 메커니즘의 작동 원리',
    16: '확인: 크레딧의 다용도 활용',
    17: '플레이어 턴의 구조',
    18: '1단계: 선택 단계 (집중 카드)',
    19: '2단계: 행동 실행 단계',
    20: '3단계: 정리 단계',
    21: '확인: 한 턴에 실행하는 행동 수는?',
    22: '함대 전투력의 상태',
    23: '함대 전투력 배치와 조선소',
    24: '함선 유형 한눈에 보기',
    25: '확인: 기술 없이 생산 가능한 함선은?',
    26: '재정비: 내 섹터 간의 평화적 이동',
    27: '침공: 새로운 섹터 정복',
    28: '확인: 재정비 이동의 조건',
    29: '결정론적 전투 (주사위 없는 전투)',
    30: '전투의 순차적 흐름',
    31: '접근 단계: 기지와 방어시설의 선제타격',
    32: '일제사격 단계: 함대 간 전면전',
    33: '확인: 두 가지 피해 흡수 유형',
    34: '전투의 승자는 누구인가?',
    35: '침공 성공 후 섹터 장악',
    36: '공허태생 섹터 vs 다른 플레이어 섹터 침공',
    37: '확인: 전투 동점 상황의 처리',
    38: '기술 카드 시스템',
    39: '기본 기술 vs 개량 기술',
    40: '확인: 개량 기술의 보유 한도',
    41: '네 가지 의제 카드 유형',
    42: '의제 카드의 사용과 배치',
    43: '확인: 부패한 의제 카드의 점수',
    44: '3개 문명 트랙과 5단계 등급',
    45: '문명 발전 규칙',
    46: '확인: 상위 티어로의 진입 조건',
    47: '부패 메커니즘의 작동 방식',
    48: '부패 획득, 이동 및 정화',
    49: '확인: 부패한 문명 트랙의 발전',
    50: '평가 단계의 순서',
    51: '유지비 지불',
    52: '은하 목표와 의제 목표 달성',
    53: '확인: 유지비 부족 시의 페널티',
    54: '경쟁 모드 종료 점수 계산',
    55: '협동 / 솔로 모드 종료 판정',
    56: '공허태생 영향력 세부 분석',
    57: '확인: 협동 모드 기본 난이도 승리 조건'
}

# Translate paragraphs & callouts using curated glossary dictionary
for s in raw_steps:
    idx = s['index']
    layer_info = None
    for l in layers_info:
        if l['stepStartIndex'] <= idx <= l['stepEndIndex']:
            layer_info = l
            break
            
    title_ko = step_titles_ko.get(idx, s['title'])
    
    # Process text blocks (replacing glossary markers to Korean labels)
    ko_text_blocks = []
    for block in s['textBlocks']:
        # Replace glossary tags: {{glossary:key|EnTerm}} -> {{glossary:key|KoTerm}}
        def repl_gloss(m):
            k = m.group(1)
            orig_t = m.group(2)
            if k in glossary_ko_map:
                return f'{{{{glossary:{k}|{glossary_ko_map[k][0]}}}}}'
            return f'{{{{glossary:{k}|{orig_t}}}}}'
            
        b_trans = re.sub(r'\{\{glossary:([a-zA-Z0-9_\-]+)\|([^}]+)\}\}', repl_gloss, block)
        ko_text_blocks.append(b_trans)
        
    # Process callouts
    ko_callouts = []
    for co in s['callouts']:
        c_text = re.sub(r'\{\{glossary:([a-zA-Z0-9_\-]+)\|([^}]+)\}\}', 
                        lambda m: f'{{{{glossary:{m.group(1)}|{glossary_ko_map.get(m.group(1), (m.group(2),))[0]}}}}}', 
                        co['content'])
        ko_callouts.append({'type': co['type'], 'content': c_text})
        
    # Process hints
    ko_hints = []
    for h in s['hints']:
        h_body = re.sub(r'\{\{glossary:([a-zA-Z0-9_\-]+)\|([^}]+)\}\}', 
                        lambda m: f'{{{{glossary:{m.group(1)}|{glossary_ko_map.get(m.group(1), (m.group(2),))[0]}}}}}', 
                        h['content'])
        ko_hints.append({'summary': h['summary'], 'content': h_body})
        
    # Process quiz
    quiz_data = s.get('quiz')
    
    step_obj = {
        'id': f'step-{idx}',
        'index': idx,
        'layerIndex': layer_info['index'] if layer_info else 0,
        'layerTitle': layer_info['title'] if layer_info else s['layer'],
        'layerTitleEn': layer_info['titleEn'] if layer_info else '',
        'title': title_ko,
        'titleEn': s['title'],
        'counterText': f'{idx + 1} / 58',
        'timeLeft': s['timeLeft'],
        'textBlocks': ko_text_blocks,
        'callouts': ko_callouts,
        'hints': ko_hints,
        'quiz': quiz_data,
        'images': s.get('images', [])
    }
    processed_steps.append(step_obj)

# Create output directories
os.makedirs('src/data', exist_ok=True)

# Save glossary.json
with open('src/data/glossary.json', 'w', encoding='utf-8') as f:
    json.dump(processed_glossary, f, ensure_ascii=False, indent=2)

# Save tutorial.json
tutorial_payload = {
    'meta': {
        'gameTitle': '보이드폴 (Voidfall)',
        'totalSteps': 58,
        'totalLayers': 16,
        'version': '1.0.0'
    },
    'layers': layers_info,
    'steps': processed_steps
}

with open('src/data/tutorial.json', 'w', encoding='utf-8') as f:
    json.dump(tutorial_payload, f, ensure_ascii=False, indent=2)

print('Successfully generated src/data/glossary.json and src/data/tutorial.json!')
