from flask import Flask, render_template, request, jsonify
from io import StringIO
from Bio import SeqIO
from Bio.SeqRecord import SeqRecord

app = Flask(__name__)

def complement_fasta(fasta_str):
    fasta_records = list(SeqIO.parse(StringIO(fasta_str), "fasta"))
    complement_records = [
        SeqRecord(seq=rec.seq.reverse_complement(), id=rec.id, description=rec.description)
        for rec in fasta_records
        ]
    output_str = StringIO()
    SeqIO.write(complement_records, output_str, "fasta")
    return output_str.getvalue()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    input_fasta = request.data.decode('utf-8')
    output_fasta = complement_fasta(input_fasta)
    return output_fasta

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
