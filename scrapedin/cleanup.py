import os
import time


def cleanup(dir_path: str, file_extension: str, file_lifespan: float):
    """
    Removes files of the specified extension if they haven't been modified in
    the last `file_lifespan` seconds.

    :param dir_path: path to the directory containing the files
    :param file_extension: extension of the files to remove
    :param file_lifespan: maximum amount of seconds during which
                          a file can exist without modification
    """
    if not os.path.exists(dir_path):
        return

    curr_time = time.time()

    with os.scandir(dir_path) as entries:
        for entry in entries:
            if entry.is_file() and entry.name.endswith(file_extension):
                last_modified = os.path.getmtime(entry.path)
                time_diff = curr_time - last_modified

                # delete file if unmodified in the last `file_lifespan` secs
                if time_diff > file_lifespan:
                    os.remove(entry.path)


if __name__ == '__main__':
    cleanup(
        dir_path=f'{os.path.dirname(__file__)}/jobs',
        file_extension='.jsonl',
        file_lifespan=1. * 3600,  # 1 hour
    )
