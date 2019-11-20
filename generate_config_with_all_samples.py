import os
import subprocess

all_wigs = subprocess.check_output("gsutil ls gs://macarthurlab-rnaseq/bigWig/", shell=True, encoding="UTF-8")

config = "[\n"
for wig in all_wigs.split():
    prefix = os.path.basename(wig).replace(".bigWig", "")

    f.write(4*" " + f"{prefix}:\n")
    f.write(6*" " + f"coverage_bigWig: {wig}\n")
    f.write(6*" " + f"spliceJunctions_bed: gs://macarthurlab-rnaseq/SJ_out_bed_for_igvjs/{prefix}.SJ.out.bed.gz\n")
    f.write(6*" " + f"bam: gs://macarthurlab-rnaseq/star/{prefix}.Aligned.sortedByCoord.out.bam\n")

    
print(files)
