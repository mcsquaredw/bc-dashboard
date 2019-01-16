export function renderFlagButton(jobId, flag) {
    if(jobId && flag) {
        return `<button class="flag-button set-flag shadow" data-jobid="${jobId}" data-flagid="${flag.Id}">                      
                    <div class="job-card-flag shadow" style="background-color: ${flag.colour}">
                        <i class="material-icons">
                            flag
                        </i>
                        ${flag.tagName}
                    </div>
                </button>`;
    } else {
        return ``;
    }
}