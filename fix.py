import re
import subprocess

def run_tsc():
    result = subprocess.run(['npx', 'tsc', '--noEmit', '--noUnusedLocals', '--noUnusedParameters'], capture_output=True, text=True)
    return result.stdout

def parse_tsc_output(output):
    errors = []
    # Match lines like: src/App.tsx:20:10 - error TS6133: 'Clock' is declared but its value is never read.
    # or src/App.tsx(20,10): error TS6133: 'Clock' is declared but its value is never read.
    pattern = re.compile(r'(.+\.tsx?)(?:[:\(])(\d+).*? error TS6133: \'(.*?)\' is declared')
    for line in output.split('\n'):
        match = pattern.search(line)
        if match:
            filepath = match.group(1).strip()
            line_num = int(match.group(2))
            var_name = match.group(3)
            errors.append((filepath, line_num, var_name))
    return errors

def fix_errors(errors):
    # Group by filepath and line_num descending to not mess up indices
    files = {}
    for filepath, line_num, var_name in errors:
        if filepath not in files:
            files[filepath] = []
        files[filepath].append((line_num, var_name))
        
    for filepath, line_errors in files.items():
        try:
            with open(filepath, 'r') as f:
                lines = f.readlines()
            
            for line_num, var_name in sorted(line_errors, reverse=True):
                idx = line_num - 1
                if idx < 0 or idx >= len(lines):
                    continue
                line = lines[idx]
                
                # Check if it's an import statement
                if 'import ' in line or 'import\t' in line or '{' in line:
                    # Remove the variable
                    # Case 1: { A, B } -> { B }
                    line = re.sub(r'\b' + var_name + r'\s*,\s*', '', line)
                    # Case 2: { B, A } -> { B }
                    line = re.sub(r',\s*' + var_name + r'\b', '', line)
                    # Case 3: { A } -> {}
                    line = re.sub(r'{\s*' + var_name + r'\s*}', '{}', line)
                    # Case 4: import A from 'a' -> import from 'a'
                    line = re.sub(r'import\s+' + var_name + r'\s+from', 'import from', line)
                    # Clean up empty imports
                    if 'import {} from' in line or 'import from' in line:
                        line = ''
                    lines[idx] = line
                else:
                    # If it's a variable declaration, just comment it out? 
                    # For now just let it be or remove the declaration.
                    pass
            with open(filepath, 'w') as f:
                f.writelines(lines)
        except Exception as e:
            print(f"Error processing {filepath}: {e}")

if __name__ == '__main__':
    for _ in range(3):
        out = run_tsc()
        errors = parse_tsc_output(out)
        if not errors:
            print("No more unused variables found.")
            break
        print(f"Found {len(errors)} errors. Fixing...")
        fix_errors(errors)
    print("Done.")

