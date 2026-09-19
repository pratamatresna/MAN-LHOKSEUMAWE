import re
import sys

def fix_unused_in_file(filepath, unused_vars):
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    for i, line in enumerate(lines):
        # We handle imports like: import { A, B, C } from 'lucide-react';
        if 'import ' in line or 'import' in line:
            for var in unused_vars:
                # regex to remove the variable from the import list
                # It can be at the start: { A, B } -> { B }
                # middle: { B, A, C } -> { B, C }
                # end: { B, A } -> { B }
                # or alone: { A } -> {}
                pattern1 = re.compile(r',\s*' + var + r'\b')
                pattern2 = re.compile(r'\b' + var + r'\s*,')
                pattern3 = re.compile(r'\b' + var + r'\b')
                
                if re.search(pattern2, line):
                    line = re.sub(pattern2, '', line)
                elif re.search(pattern1, line):
                    line = re.sub(pattern1, '', line)
                elif re.search(pattern3, line):
                    line = re.sub(pattern3, '', line)
                    
                # clean up empty imports
                line = re.sub(r'import\s*{\s*}\s*from\s*[\'"].*?[\'"];?', '', line)
            lines[i] = line
            
    with open(filepath, 'w') as f:
        f.writelines(lines)

# Will do this manually for the rest
