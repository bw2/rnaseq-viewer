f = open("rnaseq_viewer_config.all_samples.yml", "w")


f.write("""referenceGenome: "38"

locus: "chr1:50000-51000"

loci:
  - chr1
  - chr2

samplesInfo:
  controls:
    muscle:
      order: 1
      label: "Muscle"
      description: "100 samples"
      spliceJunctions_bed: gs://macarthurlab-rnaseq/GTEx_ref_data/muscle_100_GTEx_samples.SJ.out.tab.bed.gz
      coverage_bigWig: gs://macarthurlab-rnaseq/GTEx_ref_data/muscle_100_GTEx_samples.bigWig

    blood:
      order: 2
      label: "Blood"
      description: "100 samples"
      spliceJunctions_bed: gs://macarthurlab-rnaseq/GTEx_ref_data/blood_100_GTEx_samples.SJ.out.tab.bed.gz
      coverage_bigWig: gs://macarthurlab-rnaseq/GTEx_ref_data/blood_100_GTEx_samples.bigWig

    fibroblasts:
      order: 3
      label: "Fibroblasts"
      description: "100 samples"
      spliceJunctions_bed: gs://macarthurlab-rnaseq/GTEx_ref_data/fibs_100_GTEx_samples.SJ.out.tab.bed.gz
      coverage_bigWig: gs://macarthurlab-rnaseq/GTEx_ref_data/fibs_100_GTEx_samples.bigWig

  cases:
""")

import subprocess
import os
all_wigs = subprocess.check_output("gsutil ls gs://macarthurlab-rnaseq/bigWig/", shell=True, encoding="UTF-8")

files = {}
for wig in all_wigs.split():
    prefix = os.path.basename(wig).replace(".bigWig", "")

    f.write(4*" " + f"{prefix}:\n")
    f.write(6*" " + f"coverage_bigWig: {wig}\n")
    f.write(6*" " + f"spliceJunctions_bed: gs://macarthurlab-rnaseq/SJ_out_bed_for_igvjs/{prefix}.SJ.out.bed.gz\n")
    f.write(6*" " + f"bam: gs://macarthurlab-rnaseq/star/{prefix}.Aligned.sortedByCoord.out.bam\n")

    
print(files)
