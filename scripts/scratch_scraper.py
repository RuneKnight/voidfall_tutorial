import urllib.request
import http.cookiejar
import re
import json
import time

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

# Initial request
base_url = 'https://boardgamegenius.net'
resp = opener.open(base_url + '/play/voidfall')
html = resp.read().decode('utf-8')

all_steps = []

for step_idx in range(58):
    # Extract headers
    layer_m = re.search(r'class=\"step-header__layer\">([^<]+)</span>', html)
    title_m = re.search(r'class=\"step-header__title\">([^<]+)</h2>', html)
    counter_m = re.search(r'class=\"player__step-counter\">([^<]+)</span>', html)
    time_m = re.search(r'class=\"player__time-left\"[^>]*>.*?</i>\s*([^<\n]+)', html, re.DOTALL)
    
    layer_name = layer_m.group(1).strip() if layer_m else ''
    title_name = title_m.group(1).strip() if title_m else ''
    counter = counter_m.group(1).strip() if counter_m else f'{step_idx + 1} / 58'
    time_left = time_m.group(1).strip() if time_m else ''
    
    # Extract body container
    body_container_m = re.search(r'<div class=\"player__content\" id=\"step-content\">(.*?)</article>', html, re.DOTALL)
    body_container = body_container_m.group(1) if body_container_m else html

    # Text blocks
    text_blocks = []
    blocks = re.findall(r'<div class=\"step-text__block\">(.*?)</div>', body_container, re.DOTALL)
    for b in blocks:
        # replace glossary spans with markers
        b_clean = re.sub(r'<span class=\"glossary-term\" data-glossary-key=\"([^\"]+)\">([^<]+)</span>', r'{{glossary:\1|\2}}', b)
        text_blocks.append(b_clean.strip())

    # Callouts
    callouts = []
    co_matches = re.findall(r'<aside class=\"step-callout step-callout--([^\"]+)\"[^>]*>.*?<div class=\"step-callout__text\">(.*?)</div>\s*</aside>', body_container, re.DOTALL)
    for co_type, co_text in co_matches:
        co_clean = re.sub(r'<span class=\"glossary-term\" data-glossary-key=\"([^\"]+)\">([^<]+)</span>', r'{{glossary:\1|\2}}', co_text)
        callouts.append({'type': co_type, 'content': co_clean.strip()})

    # Hints / Collapsible sections
    hints = []
    hint_matches = re.findall(r'<details class=\"step-hint\"[^>]*>.*?<summary class=\"step-hint__summary\">.*?<span[^>]*>(.*?)</span>.*?</summary>\s*<div class=\"step-hint__body\">(.*?)</div>\s*</details>', body_container, re.DOTALL)
    for h_sum, h_body in hint_matches:
        h_clean = re.sub(r'<span class=\"glossary-term\" data-glossary-key=\"([^\"]+)\">([^<]+)</span>', r'{{glossary:\1|\2}}', h_body)
        hints.append({'summary': h_sum.strip(), 'content': h_clean.strip()})

    # Quiz / Check questions if present
    quiz = None
    quiz_wrap = re.search(r'<div class=\"quiz-step[^\"]*\"[^>]*>(.*?)</div>\s*</article>', html, re.DOTALL)
    if not quiz_wrap:
        quiz_wrap = re.search(r'<form class=\"quiz[^\"]*\"[^>]*>(.*?)</form>', html, re.DOTALL)
    
    # Check question options
    option_matches = re.findall(r'<label class=\"quiz-option[^\"]*\"[^>]*>.*?<input[^>]+value=\"([^\"]+)\"[^>]*>.*?<span class=\"quiz-option__text\">([^<]+)</span>', html, re.DOTALL)
    if option_matches:
        q_text_m = re.search(r'<div class=\"quiz__question\">([^<]+)</div>', html) or re.search(r'<h3 class=\"quiz[^\"]*\">([^<]+)</h3>', html)
        quiz = {
            'question': q_text_m.group(1).strip() if q_text_m else '',
            'options': [{'value': v, 'text': t.strip()} for v, t in option_matches]
        }

    # Images
    images = []
    img_matches = re.findall(r'<figure class=\"step-media__figure\">.*?<img[^>]+src=\"([^\"]+)\"[^>]*>.*?<figcaption class=\"step-media__caption\">([^<]*)</figcaption>', body_container, re.DOTALL)
    for src, cap in img_matches:
        images.append({'src': src, 'caption': cap.strip()})

    step_info = {
        'index': step_idx,
        'layer': layer_name,
        'title': title_name,
        'counter': counter,
        'timeLeft': time_left,
        'textBlocks': text_blocks,
        'callouts': callouts,
        'hints': hints,
        'quiz': quiz,
        'images': images,
        'rawHtml': body_container
    }
    all_steps.append(step_info)
    print(f'[{step_idx + 1}/58] ({layer_name}) {title_name}')

    if step_idx == 57:
        break

    # Find next button URL
    next_m = re.search(r'class=\"player__btn player__btn--primary\"\s+hx-post=\"([^\"]+)\"', html)
    if not next_m:
        print(f'Done or no next button at step {step_idx + 1}')
        break
    next_url = base_url + next_m.group(1)
    req = urllib.request.Request(next_url, data=b'', headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'HX-Request': 'true',
        'HX-Target': 'PlayerShell-a934cb6d'
    })
    resp = opener.open(req)
    html = resp.read().decode('utf-8')
    time.sleep(0.05)

with open('scraped_all_steps.json', 'w', encoding='utf-8') as f:
    json.dump(all_steps, f, ensure_ascii=False, indent=2)

print('Successfully scraped all steps!')
