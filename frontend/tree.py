import os


def generate_directory_structure(path, indent=0):
    try:
        items = sorted(os.listdir(path))  # Получить список всех файлов и папок в директории
    except PermissionError:
        return f"{'│   ' * indent}├── [ACCESS DENIED]\n"

    structure = ""

    for index, item in enumerate(items):
        # Пропускаем директории node_modules и файл tree.py
        if item in ("node_modules", "tree.py", ".dockerignore", ".gitignore", ".gitkeep", ".babelrc"):
            continue

        is_last = index == len(items) - 1
        connector = "└── " if is_last else "├── "
        full_path = os.path.join(path, item)

        structure += f"{'│   ' * indent}{connector}{item}\n"

        if os.path.isdir(full_path):  # Если это папка, рекурсивно добавляем её содержимое
            sub_indent = indent + 1
            structure += generate_directory_structure(full_path, sub_indent)

    return structure

# Задайте путь к директории
root_path = "/Users/margaritapopova/Documents/Programming/YandexPracticum/SystemArchitect/sprint_1/architecture-sprint-1/frontend"
print(f"{root_path}/")
print(generate_directory_structure(root_path))
