import pyinstaller_helper
 
pyinstaller_helper.build({
    'script': 'main.py',
    'application_name': 'Dream Stream',
    'version': '1.0.0.0',
    'icon_win': '',
    'company_name': u'',
    'product_name': u'Dream Stream',
    'internal_name': 'dream_stream',
    'original_filename': u'Dream Stream',
    'file_description': 'Dream Stream',
    'legal_copyright': '',
    'legal_trademark': ''
})

import os
import shutil

path = os.path.dirname(os.path.abspath(__file__))

try:
    output_exe = path + '\\dist\\' + [name for name in os.listdir(path + '\\dist') if '.exe' in name][0]
    try:
        os.remove(path + '\\main.exe')
    except:
        pass
    os.rename(output_exe, path + '\\main.exe')
except:
    pass

spec_files = [name for name in os.listdir(path) if '.spec' in name]
for file in spec_files:
    os.remove(file)

try:
    shutil.rmtree(path + '\\build')
    shutil.rmtree(path + '\\dist')
except:
    pass
