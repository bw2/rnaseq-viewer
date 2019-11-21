import os
import subprocess

all_wigs = subprocess.check_output("gsutil ls gs://macarthurlab-rnaseq/bigWig/", shell=True, encoding="UTF-8")

print("[")
for wig in all_wigs.split():

    prefix = os.path.basename(wig).replace(".bigWig", "")
    print(f"""
    {{
        label: "{prefix.upper()}",
        junctions: " gs://macarthurlab-rna]seq/SJ_out_bed_for_igvjs/{prefix}.SJ.out.bed.gz",
        bam: "gs://macarthurlab-rnaseq/star/{prefix}.Aligned.sortedByCoord.out.bam",
    }},
    """)
print("]")
