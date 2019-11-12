from django.db import models

#  Allow adding the custom json_fields and internal_json_fields to the model Meta
# (from https://stackoverflow.com/questions/1088431/adding-attributes-into-django-models-meta-class)
models.options.DEFAULT_NAMES = models.options.DEFAULT_NAMES + ('json_fields',)

GENOME_VERSION_GRCh37 = "37"
GENOME_VERSION_GRCh38 = "38"

GENOME_VERSION_CHOICES = [
    (GENOME_VERSION_GRCh37, "GRCh37"),
    (GENOME_VERSION_GRCh38, "GRCh38")
]


class GeneInfo(models.Model):
    """Human gene models from https://www.gencodegenes.org/releases/
    http://www.gencodegenes.org/gencodeformat.html
    """

    # gencode fields
    gene_id = models.CharField(max_length=20, db_index=True, unique=True)   # without the version suffix (eg. "ENSG0000012345")
    gene_symbol = models.TextField(null=True, blank=True)

    chrom_grch37 = models.CharField(max_length=2, null=True, blank=True)
    start_grch37 = models.IntegerField(null=True, blank=True)
    end_grch37 = models.IntegerField(null=True, blank=True)
    strand_grch37 = models.CharField(max_length=1, null=True, blank=True)
    coding_region_size_grch37 = models.IntegerField(default=0)  # number of protein-coding base-pairs in this gene (= 0 for non-coding genes)

    chrom_grch38 = models.CharField(max_length=2, null=True, blank=True)
    start_grch38 = models.IntegerField(null=True, blank=True)
    end_grch38 = models.IntegerField(null=True, blank=True)
    strand_grch38 = models.CharField(max_length=1, null=True, blank=True)
    coding_region_size_grch38 = models.IntegerField(default=0)  # number of protein-coding base-pairs in this gene (= 0 for non-coding genes)

    # gencode-specific fields, although models could hypothetically come from refseq or other places
    gencode_gene_type = models.TextField(null=True, blank=True)
    gencode_release = models.IntegerField(null=True, blank=True)

    class Meta:
        json_fields = [
            'gene_id', 'gene_symbol', 'chrom_grch37', 'start_grch37', 'end_grch37', 'chrom_grch38', 'start_grch38',
            'end_grch38', 'gencode_gene_type', 'coding_region_size_grch37', 'coding_region_size_grch38',
        ]


class TranscriptInfo(models.Model):
    gene = models.ForeignKey(GeneInfo, on_delete=models.CASCADE)

    transcript_id = models.CharField(max_length=20, db_index=True, unique=True)  # without the version suffix
    #protein_id = models.CharField(max_length=20, null=True)

    chrom_grch37 = models.CharField(max_length=2, null=True, blank=True)
    start_grch37 = models.IntegerField(null=True, blank=True)
    end_grch37 = models.IntegerField(null=True, blank=True)
    strand_grch37 = models.CharField(max_length=1, null=True, blank=True)
    coding_region_size_grch37 = models.IntegerField(default=0)  # number of protein-coding bases (= 0 for non-coding genes)

    chrom_grch38 = models.CharField(max_length=2, null=True, blank=True)
    start_grch38 = models.IntegerField(null=True, blank=True)
    end_grch38 = models.IntegerField(null=True, blank=True)
    strand_grch38 = models.CharField(max_length=1, null=True, blank=True)
    coding_region_size_grch38 = models.IntegerField(default=0)  # number of protein-coding bases (= 0 for non-coding genes)

