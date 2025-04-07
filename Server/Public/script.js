document.addEventListener('DOMContentLoaded', function() {
    // Helper function to attach copy-to-clipboard behavior
    function attachCopyListener(element, text) {
      element.style.cursor = 'pointer';
      element.title = 'Click to copy ID';
      element.addEventListener('click', () => {
        navigator.clipboard.writeText(text)
          .then(() => {
            const originalText = element.textContent;
            element.textContent = "Copied: " + text;
            setTimeout(() => {
              element.textContent = originalText;
            }, 2000);
          })
          .catch(err => console.error('Failed to copy: ', err));
      });
    }
  
    // --- PAGES FUNCTIONALITY ---
  
    function displayPages(pagesData) {
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = ''; // Clear previous results
  
      if (pagesData && pagesData.length > 0) {
        pagesData.forEach(page => {
          // Create a card for each page
          const card = document.createElement('div');
          card.className = 'page-card';
  
          const title = document.createElement('h2');
          title.textContent = page.title;
  
          const idElem = document.createElement('small');
          idElem.textContent = 'ID: ' + page.id;
          attachCopyListener(idElem, page.id);
  
          const contentPre = document.createElement('pre');
          // Insert newline between HTML tags for readability
          const formattedContent = page.content.replace(/></g, '>\n<');
          contentPre.textContent = formattedContent;
  
          // Create Edit and Delete buttons
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.className = 'edit-button';
  
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.className = 'delete-button';
  
          // Append elements to card
          card.appendChild(title);
          card.appendChild(idElem);
          card.appendChild(contentPre);
          card.appendChild(editButton);
          card.appendChild(deleteButton);
          resultsDiv.appendChild(card);
  
          // Edit button event listener
          editButton.addEventListener('click', () => {
            // Create an inline edit form
            const editForm = document.createElement('form');
            editForm.className = 'edit-form';
  
            const titleLabel = document.createElement('label');
            titleLabel.textContent = 'Title:';
            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.value = page.title;
  
            const contentLabel = document.createElement('label');
            contentLabel.textContent = 'Content:';
            const contentTextarea = document.createElement('textarea');
            contentTextarea.value = page.content;
  
            const saveButton = document.createElement('button');
            saveButton.type = 'submit';
            saveButton.textContent = 'Save';
  
            const cancelButton = document.createElement('button');
            cancelButton.type = 'button';
            cancelButton.textContent = 'Cancel';
  
            // Append form fields and buttons
            editForm.appendChild(titleLabel);
            editForm.appendChild(titleInput);
            editForm.appendChild(contentLabel);
            editForm.appendChild(contentTextarea);
            editForm.appendChild(saveButton);
            editForm.appendChild(cancelButton);
  
            // Replace the card content with the edit form
            card.innerHTML = '';
            card.appendChild(editForm);
  
            // Cancel button restores the original card display
            cancelButton.addEventListener('click', () => {
              displayPages([page]);
            });
  
            // Handle the edit form submission
            editForm.addEventListener('submit', function(e) {
              e.preventDefault();
              const updatedTitle = titleInput.value;
              const updatedContent = contentTextarea.value;
  
              fetch(`http://localhost/pages/${page.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: updatedTitle, content: updatedContent })
              })
                .then(response => response.json())
                .then(data => {
                  if(data.data) {
                    displayPages([data.data]);
                  } else {
                    alert('Error updating page.');
                  }
                })
                .catch(error => {
                  console.error('Error updating page:', error);
                });
            });
          });
  
          // Delete button event listener
          deleteButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this page?')) {
              fetch(`http://localhost/pages/${page.id}`, {
                method: 'DELETE'
              })
                .then(response => response.json())
                .then(data => {
                  // Remove the card from the display
                  card.remove();
                })
                .catch(error => {
                  console.error('Error deleting page:', error);
                });
            }
          });
        });
      } else {
        resultsDiv.innerHTML = '<p>No pages found.</p>';
      }
    }
  
    // Handle Search Form submission for pages
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
      filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const params = new URLSearchParams(new FormData(e.target)).toString();
        fetch('/pages?' + params)
          .then(response => response.json())
          .then(data => {
            if(data.data) {
              displayPages(data.data);
            } else {
              document.getElementById('results').innerHTML = '<p>No pages found.</p>';
            }
          })
          .catch(error => {
            console.error('Error fetching pages:', error);
            document.getElementById('results').innerHTML = '<p>Error fetching pages.</p>';
          });
      });
    }
  
    // Handle Create Page Form submission
    const createForm = document.getElementById('createForm');
    if (createForm) {
      createForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('createTitle').value;
        const content = document.getElementById('createContent').value;
  
        fetch('http://localhost/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content })
        })
          .then(response => response.json())
          .then(data => {
            const messageDiv = document.getElementById('createMessage');
            if(data.data) {
              messageDiv.innerHTML = '<div class="message success">Page created successfully!</div>';
              createForm.reset();
              displayPages([data.data]);
            } else {
              messageDiv.innerHTML = '<div class="message error">Error creating page.</div>';
            }
          })
          .catch(error => {
            console.error('Error creating page:', error);
            document.getElementById('createMessage').innerHTML = '<div class="message error">Error creating page.</div>';
          });
      });
    }
  
    // --- IMAGE FUNCTIONALITY ---
  
    // Handle Image Upload Form submission using FileReader
    const imageUploadForm = document.getElementById('imageUploadForm');
    if (imageUploadForm) {
      imageUploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const imageTitle = document.getElementById('imageTitle').value;
        const imageAltText = document.getElementById('imageAltText').value;
        const imageInput = document.getElementById('imageInput');
  
        if (imageInput.files.length === 0) {
          alert('Please select an image file.');
          return;
        }
  
        const file = imageInput.files[0];
        const reader = new FileReader();
  
        reader.onload = function(e) {
          const fileData = e.target.result;
          const payload = {
            title: imageTitle,
            altText: imageAltText,
            content: fileData
          };
  
          fetch('http://localhost/images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
            .then(response => response.json())
            .then(data => {
              const imageMessageDiv = document.getElementById('imageMessage');
              if(data.data) {
                imageMessageDiv.innerHTML = '<div class="message success">Image uploaded successfully!</div>';
                imageUploadForm.reset();
                loadImages();
              } else {
                imageMessageDiv.innerHTML = '<div class="message error">Error uploading image.</div>';
              }
            })
            .catch(error => {
              console.error('Error uploading image:', error);
              document.getElementById('imageMessage').innerHTML = '<div class="message error">Error uploading image.</div>';
            });
        };
  
        reader.readAsDataURL(file);
      });
    }
  
    // Function to load and display images in the Image Library section
    function loadImages() {
      fetch('http://localhost/images')
        .then(response => response.json())
        .then(data => {
          const imageLibraryDiv = document.getElementById('imageLibrary');
          imageLibraryDiv.innerHTML = '';
          if (data.data && data.data.length > 0) {
            data.data.forEach(image => {
              // Create a container card for each image
              const card = document.createElement('div');
              card.className = 'image-card';
  
              // Create the image element
              const imgElem = document.createElement('img');
              imgElem.src = image.content;
              imgElem.alt = image.altText;
              imgElem.title = image.title;
              imgElem.style.maxWidth = '200px';
              imgElem.style.display = 'block';
              imgElem.style.marginBottom = '10px';
  
              // Create an info div for title and alt text
              const infoDiv = document.createElement('div');
              const titleElem = document.createElement('h3');
              titleElem.textContent = image.title;
              titleElem.style.margin = '0';
              const altElem = document.createElement('p');
              altElem.textContent = `Alt: ${image.altText}`;
              altElem.style.margin = '5px 0';
              infoDiv.appendChild(titleElem);
              infoDiv.appendChild(altElem);
  
              // Create a new element to display the image ID with copy functionality
              const idElem = document.createElement('small');
              idElem.textContent = "ID: " + image.id;
              attachCopyListener(idElem, image.id);
              idElem.style.display = 'block';
              idElem.style.marginBottom = '10px';
  
              // Create Edit and Delete buttons
              const editButton = document.createElement('button');
              editButton.textContent = 'Edit';
              editButton.className = 'edit-button';
              editButton.style.marginRight = '5px';
  
              const deleteButton = document.createElement('button');
              deleteButton.textContent = 'Delete';
              deleteButton.className = 'delete-button';
  
              // Append elements to card
              card.appendChild(imgElem);
              card.appendChild(infoDiv);
              card.appendChild(idElem);
              card.appendChild(editButton);
              card.appendChild(deleteButton);
              imageLibraryDiv.appendChild(card);
  
              // Edit button event listener
              editButton.addEventListener('click', () => {
                const editForm = document.createElement('form');
                editForm.className = 'edit-form';
  
                const titleLabel = document.createElement('label');
                titleLabel.textContent = 'Title:';
                const titleInput = document.createElement('input');
                titleInput.type = 'text';
                titleInput.value = image.title;
                titleInput.style.display = 'block';
                titleInput.style.marginBottom = '5px';
  
                const altLabel = document.createElement('label');
                altLabel.textContent = 'Alt Text:';
                const altInput = document.createElement('input');
                altInput.type = 'text';
                altInput.value = image.altText;
                altInput.style.display = 'block';
                altInput.style.marginBottom = '5px';
  
                const saveButton = document.createElement('button');
                saveButton.type = 'submit';
                saveButton.textContent = 'Save';
                saveButton.style.marginRight = '5px';
  
                const cancelButton = document.createElement('button');
                cancelButton.type = 'button';
                cancelButton.textContent = 'Cancel';
  
                editForm.appendChild(titleLabel);
                editForm.appendChild(titleInput);
                editForm.appendChild(altLabel);
                editForm.appendChild(altInput);
                editForm.appendChild(saveButton);
                editForm.appendChild(cancelButton);
  
                card.innerHTML = '';
                card.appendChild(editForm);
  
                cancelButton.addEventListener('click', () => {
                  loadImages();
                });
  
                editForm.addEventListener('submit', function(e) {
                  e.preventDefault();
                  const updatedTitle = titleInput.value;
                  const updatedAltText = altInput.value;
                  const payload = { title: updatedTitle, altText: updatedAltText };
  
                  fetch(`http://localhost/images/${image.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  })
                    .then(response => response.json())
                    .then(() => {
                      loadImages();
                    })
                    .catch(error => {
                      console.error('Error updating image:', error);
                    });
                });
              });
  
              // Delete button event listener
              deleteButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this image?')) {
                  fetch(`http://localhost/images/${image.id}`, {
                    method: 'DELETE'
                  })
                    .then(response => response.json())
                    .then(() => {
                      loadImages();
                    })
                    .catch(error => {
                      console.error('Error deleting image:', error);
                    });
                }
              });
            });
          } else {
            imageLibraryDiv.innerHTML = '<p>No images found.</p>';
          }
        })
        .catch(error => {
          console.error('Error fetching images:', error);
          document.getElementById('imageLibrary').innerHTML = '<p>Error fetching images.</p>';
        });
    }
  
    // --- PAGE-IMAGE ASSOCIATION FUNCTIONALITY ---
  
    function loadPageImageAssociations(pageId) {
      fetch(`http://localhost/page-images/${pageId}`)
        .then(response => response.json())
        .then(data => {
          const resultsDiv = document.getElementById('pageImageResults');
          if (data.data && data.data.length > 0) {
            // Render each association; IDs are rendered in <small> tags with a data-copy attribute
            resultsDiv.innerHTML = data.data
              .map(assoc => `
                <div class="page-image-association">
                  <h3>${assoc.imageTitle}</h3>
                  <p>
                    <small class="copyable" data-copy="${assoc.pageId}" style="cursor:pointer;">
                      Page ID: ${assoc.pageId}
                    </small>
                  </p>
                  <p>
                    <small class="copyable" data-copy="${assoc.imageId}" style="cursor:pointer;">
                      Image ID: ${assoc.imageId}
                    </small>
                  </p>
                  <p>HTML Title: ${assoc.htmlTitle}</p>
                  <img src="${assoc.imageContent}" alt="${assoc.altText}" style="max-width:200px;">
                </div>
              `)
              .join('');
  
            // Attach copy listeners to each newly rendered copyable element
            const copyableEls = resultsDiv.querySelectorAll('.copyable');
            copyableEls.forEach(el => {
              const textToCopy = el.getAttribute('data-copy');
              attachCopyListener(el, textToCopy);
            });
          } else {
            resultsDiv.innerHTML = '<p>No image associations found for this page.</p>';
          }
        })
        .catch(error => {
          console.error('Error fetching associations:', error);
          document.getElementById('pageImageResults').innerHTML = '<p>Error fetching associations.</p>';
        });
    }
  
    document.getElementById('loadPageImagesBtn').addEventListener('click', function() {
      const pageId = document.getElementById('searchPageId').value;
      if (pageId.trim() !== '') {
        loadPageImageAssociations(pageId);
      } else {
        alert('Please enter a valid page ID.');
      }
    });
  
    // Handle association creation
    const associateForm = document.getElementById('associateForm');
    if (associateForm) {
      associateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const pageId = document.getElementById('assocPageId').value;
        const imageId = document.getElementById('assocImageId').value;
  
        fetch('http://localhost/page-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageId, imageId })
        })
          .then(response => response.json())
          .then(data => {
            const msgDiv = document.getElementById('pageImageMessage');
            if (data.data) {
              msgDiv.innerHTML = '<div class="message success">Association created successfully!</div>';
              associateForm.reset();
            } else {
              msgDiv.innerHTML = '<div class="message error">Error creating association.</div>';
            }
          })
          .catch(error => {
            console.error('Error creating association:', error);
            document.getElementById('pageImageMessage').innerHTML = '<div class="message error">Error creating association.</div>';
          });
      });
    }
  
    // Handle association deletion
    const deleteAssociationForm = document.getElementById('deleteAssociationForm');
    if (deleteAssociationForm) {
      deleteAssociationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const pageId = document.getElementById('deletePageId').value;
        const imageId = document.getElementById('deleteImageId').value;
  
        fetch(`http://localhost/page-images/${pageId}/${imageId}`, {
          method: 'DELETE'
        })
          .then(response => response.json())
          .then(data => {
            const msgDiv = document.getElementById('pageImageMessage');
            if (data.data) {
              msgDiv.innerHTML = '<div class="message success">Association deleted successfully!</div>';
              deleteAssociationForm.reset();
            } else {
              msgDiv.innerHTML = '<div class="message error">Error deleting association.</div>';
            }
          })
          .catch(error => {
            console.error('Error deleting association:', error);
            document.getElementById('pageImageMessage').innerHTML = '<div class="message error">Error deleting association.</div>';
          });
      });
    }
  
    // Load images on initial page load
    loadImages();
  });
  