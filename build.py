#!/usr/bin/env python3
"""Build offline play.html from modular vanilla JS/CSS sources."""
from pathlib import Path
import shutil
import re
base = Path(__file__).resolve().parent
src = (base/'index.html').read_text(encoding='utf-8')
css = (base/'css/style.css').read_text(encoding='utf-8')
scripts = []
for name in ('config','player','avatar','customEvents','ageSpecificEvents','events','actions','leaderboard','lifeArchive','engine','ui','main'):
    text = (base/'js'/f'{name}.js').read_text(encoding='utf-8')
    text = re.sub(r'^import\s+.*?from\s+[\'"].*?[\'"].*?;\s*$', '', text, flags=re.M)
    text = re.sub(r'\bexport\s+(?=(?:function|const|let|class|async|var)\b)', '', text)
    scripts.append('// ===== '+name+'.js =====\n'+text)
js = '\n\n'.join(scripts)
if re.search('</script',js,re.I):
    raise ValueError('Unsafe inline script close tag')
src = src.replace('  <link rel="stylesheet" href="./css/style.css" />', '<style>\n'+css+'\n</style>')
src = src.replace('  <script type="module" src="./js/main.js"></script>', '  <script>\n'+js+'\n</script>')
assert 'data-command="archive"' in src
(base/'play.html').write_text(src,encoding='utf-8')
print('Built play.html',len(src),'characters')

# Keep server sources and SQL outside of the public publish directory.
public = base/'public'
public.mkdir(exist_ok=True)
shutil.copy2(base/'index.html',public/'index.html')
# Do not publish the offline version: /play.html would show a local leaderboard.
(public/'play.html').unlink(missing_ok=True)
for folder in ('css','js'):
    shutil.copytree(base/folder,public/folder,dirs_exist_ok=True)
print('Prepared public/ for Netlify')
