import re
import glob

for filepath in glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.ts', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find lucide-react import
    lucide_import_match = re.search(r"import\s*\{([\s\S]*?)\}\s*from\s*['\"]lucide-react['\"];?", content)
    if not lucide_import_match:
        continue
        
    icons_str = lucide_import_match.group(1)
    # Get list of icons imported
    imported_icons = [i.strip() for i in icons_str.replace('\n', '').split(',') if i.strip()]
    
    # Check which are actually used in the file
    # we can find occurrences of the icon name outside the import block
    # A simple hack: count total occurrences of the word. If > 1, it's used.
    used_icons = []
    for icon in imported_icons:
        # count occurrences of word boundary icon
        count = len(re.findall(r'\b' + icon + r'\b', content))
        if count > 1:
            used_icons.append(icon)
            
    if len(used_icons) != len(imported_icons):
        print(f"Fixing lucide-react imports in {filepath}: removing {set(imported_icons) - set(used_icons)}")
        if used_icons:
            new_import = "import { " + ", ".join(used_icons) + " } from 'lucide-react';"
        else:
            new_import = ""
            
        content = content.replace(lucide_import_match.group(0), new_import)
        
        with open(filepath, 'w') as f:
            f.write(content)

