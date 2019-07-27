#!/usr/bin/env python3

import sys
import re
import yaml
import os


def edit_front_matter(filepath):
    front_matter = get_front_matter(filepath)
    filename = os.path.basename(filepath)

    # Add the publish date to front matter. Hugo gets the date from front
    # matter, Jekyll gets it from the file path. Some old Jekyll posts didn't
    # have a date set in front matter.
    if "date" not in front_matter:
        assert re.search("^\\d{4}-\\d{2}-\\d{2}", filename) is not None
        date = filename[:10]
        front_matter["date"] = date

    # Add an alias for the old Jekyll URL
    if "aliases" not in front_matter:
        old_url = filename.replace("-", "/", 3).split(".")[0]
        aliases = ["/tech/{}".format(old_url)]
        front_matter["aliases"] = aliases

    set_front_matter(filepath, front_matter)


def get_front_matter(filename) -> dict:
    with open(filename) as f:
        data = f.read()
    sections = data.split("---\n", 2)
    assert len(sections) == 3

    front_matter = sections[1]
    return yaml.safe_load(front_matter)


def set_front_matter(filename, front_matter):
    sections = [
        "",
        yaml.dump(front_matter, indent=4, default_flow_style=False),
        get_content(filename),
    ]
    data = "---\n".join(sections)
    # print(data)

    with open(filename, "w") as f:
        f.write(data)


def get_content(filename) -> str:
    with open(filename) as f:
        data = f.read()
    sections = data.split("---\n", 2)
    assert len(sections) == 3
    return sections[2]


if __name__ == "__main__":
    filenames = sys.argv[1:]
    for name in filenames:
        edit_front_matter(name)
