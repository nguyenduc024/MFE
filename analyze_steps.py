import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('mifos_dataset.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

seq = []
for c in d['commands']:
    op = f"{c['action_name']} {c['entity_name']}"
    if not seq or seq[-1][0] != op:
        seq.append([op, 1])
    else:
        seq[-1][1] += 1

print(f"Total phases identified: {len(seq)}")
for i, (op, count) in enumerate(seq):
    print(f"{i+1:2d}. {op:<35} (thực hiện {count:>2} lần)")
