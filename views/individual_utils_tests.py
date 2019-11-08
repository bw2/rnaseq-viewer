# -*- coding: utf-8 -*-

import json

from django.test import TestCase

from openpyxl import load_workbook
from StringIO import StringIO

from seqr.models import Individual
from seqr.views.utils.individual_utils import export_individuals, _parse_phenotips_data


class ExportTableUtilsTest(TestCase):
    fixtures = ['users', '1kg_project']

    def test_export_individuals(self):
        test_individuals = Individual.objects.filter(individual_id='NA19675_1')

        # test tsv with all columns
        response = export_individuals(
            'test_individuals_table',
            test_individuals,
            'tsv',
            include_project_name=True,
            include_case_review_status=True,
            include_case_review_last_modified_date=True,
            include_case_review_last_modified_by=True,
            include_case_review_discussion=True,
            include_hpo_terms_present=True,
            include_hpo_terms_absent=True,
            include_paternal_ancestry=True,
            include_maternal_ancestry=True,
            include_age_of_onset=True,
        )
        self.assertEqual(response.status_code, 200)
        rows = [row.split('\t') for row in response.content.rstrip('\n').split('\n')]

        self.assertEqual(rows[0][0], 'Project')
        self.assertEqual(rows[0][1], 'Family ID')
        self.assertEqual(len(rows), 2)

        # test Excel format
        response = export_individuals(
            'test_families_table',
            test_individuals,
            'xls',
            include_project_name=True,
            include_case_review_status=True,
            include_case_review_last_modified_date=True,
            include_case_review_last_modified_by=True,
            include_case_review_discussion=True,
            include_hpo_terms_present=True,
            include_hpo_terms_absent=True,
            include_paternal_ancestry=True,
            include_maternal_ancestry=True,
            include_age_of_onset=True)
        self.assertEqual(response.status_code, 200)
        load_workbook(StringIO(response.content))

        # test unknown format
        self.assertRaisesRegexp(ValueError, '.*format.*',
                                lambda: export_individuals('test_families_table', test_individuals, file_format='unknown_format'))

    def test_parse_phenotips_data(self):
        test_individuals = Individual.objects.filter(individual_id='NA19675_1')

        phenotips_json = json.loads(test_individuals[0].phenotips_data)

        parsed_data = _parse_phenotips_data(phenotips_json)

        self.assertSetEqual(
            set(parsed_data.keys()),
            {'age_of_onset', 'candidate_genes', 'maternal_ancestry', 'paternal_ancestry', 'phenotips_features_absent', 'phenotips_features_present', 'previously_tested_genes'}
        )

        self.assertEqual(parsed_data['age_of_onset'], 'Adult onset')
        self.assertEqual(parsed_data['candidate_genes'], 'EHBP1L1 (comments EHBP1L1), ACY3 (comments ACY3)')
        self.assertEqual(parsed_data['paternal_ancestry'], 'African Americans')
        self.assertEqual(parsed_data['maternal_ancestry'], 'Azerbaijanis')
        self.assertEqual(parsed_data['phenotips_features_absent'], 'Arrhythmia, Complete atrioventricular canal defect, Failure to thrive')
        self.assertEqual(parsed_data['phenotips_features_present'], 'Defect in the atrial septum, Morphological abnormality of the central nervous system, Tetralogy of Fallot')
        self.assertEqual(parsed_data['previously_tested_genes'], 'IKBKAP (comments IKBKAP), CCDC102B (comments for CCDC102B)')
