#!/usr/bin/env python
"""
A command line helper for common operations performed by Galaxy maintainers.
Encodes and decodes IDs, returns Dataset IDs if provided an HDA or LDDA id,
returns the disk path of a dataset.
"""
from __future__ import print_function

import os
import sys
from optparse import OptionParser

from six.moves.configparser import ConfigParser

sys.path.insert(1, os.path.join(os.path.dirname(__file__), os.pardir, 'lib'))

from galaxy.model import mapping
from galaxy.web import security

default_config = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir, 'config/galaxy.ini'))

parser = OptionParser()
parser.add_option('-c', '--config', dest='config', help='Path to Galaxy config file (config/galaxy.ini)', default=default_config)
parser.add_option('-e', '--encode-id', dest='encode_id', help='Encode an ID')
parser.add_option('-d', '--decode-id', dest='decode_id', help='Decode an ID')
parser.add_option('--hda', dest='hda_id', help='Display HistoryDatasetAssociation info')
parser.add_option('--ldda', dest='ldda_id', help='Display LibraryDatasetDatasetAssociation info')
(options, args) = parser.parse_args()

try:
    assert options.encode_id or options.decode_id or options.hda_id or options.ldda_id
except Exception:
    parser.print_help()
    sys.exit(1)

options.config = os.path.abspath(options.config)

config = ConfigParser(dict(file_path='database/files',
                           id_secret='USING THE DEFAULT IS NOT SECURE!',
                           database_connection='sqlite:///database/universe.sqlite?isolation_level=IMMEDIATE'))
config.read(options.config)

helper = security.SecurityHelper(id_secret=config.get('app:main', 'id_secret'))
model = mapping.init(config.get('app:main', 'file_path'), config.get('app:main', 'database_connection'), create_tables=False)

if options.encode_id:
    print('Encoded "%s": %s' % (options.encode_id, helper.encode_id(options.encode_id)))

if options.decode_id:
    print('Decoded "%s": %s' % (options.decode_id, helper.decode_id(options.decode_id)))

if options.hda_id:
    try:
        hda_id = int(options.hda_id)
    except Exception:
        hda_id = int(helper.decode_id(options.hda_id))
    hda = model.context.current.query(model.HistoryDatasetAssociation).get(hda_id)
    print('HDA "%s" is Dataset "%s" at: %s' % (hda.id, hda.dataset.id, hda.file_name))

if options.ldda_id:
    try:
        ldda_id = int(options.ldda_id)
    except Exception:
        ldda_id = int(helper.decode_id(options.ldda_id))
    ldda = model.context.current.query(model.HistoryDatasetAssociation).get(ldda_id)
    print('LDDA "%s" is Dataset "%s" at: %s' % (ldda.id, ldda.dataset.id, ldda.file_name))
