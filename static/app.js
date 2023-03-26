function handleFileSelect(evt) {
evt.stopPropagation();
evt.preventDefault();
const file = evt.dataTransfer.files[0];
if (!file.name.endsWith('.fasta')) {
    alert('Please upload a FASTA file.');
    return;
}

const reader = new FileReader();
reader.onload = function(event) {
    const contents = event.target.result;
    $('#input-sequences').text(contents);
};
reader.readAsText(file);
}

function handleDragOver(evt) {
evt.stopPropagation();
evt.preventDefault();
evt.dataTransfer.dropEffect = 'copy';
};

function analyzeSequences() {
const inputSequences = $('#input-sequences').text();
if (!inputSequences) {
alert('Please upload a FASTA file.');
return;
}
$.ajax({
    type: 'POST',
    url: '/analyze',
    data: inputSequences,
    contentType: 'text/plain',
    success: function(outputSequences) {
        $('#output-sequences').text(outputSequences);
        $('#download-btn').show();
    },
    error: function() {
        alert('An error occurred while processing the sequences.');
    }
});
}

function downloadSequences() {
const outputSequences = $('#output-sequences').text();
const blob = new Blob([outputSequences], {type: 'text/plain;charset=utf-8'});
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'complementary_sequences.fasta';
link.click();
setTimeout(() => URL.revokeObjectURL(url), 100);
}

$('#fasta-file').on('change', function(evt) {
const file = evt.target.files[0];
if (!file.name.endsWith('.fasta')) {
alert('Please upload a FASTA file.');
return;
}

const reader = new FileReader();
reader.onload = function(event) {
    const contents = event.target.result;
    $('#input-sequences').text(contents);
};
reader.readAsText(file);
});

$('#analyze-btn').on('click', analyzeSequences);
$('#download-btn').on('click', downloadSequences);

const dropZone = document.body;
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
