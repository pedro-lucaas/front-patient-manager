import { Flex, Input, Button, Icon } from '@chakra-ui/react';
import JoditEditor, { Jodit } from 'jodit-react';
import { IJodit } from 'jodit/types';
import React, { useRef } from 'react';
import { MdDelete } from 'react-icons/md';
import { RichTextProps } from '.';
import { preparePaste, uploadImage, save } from './jodit-plugins';
import './RichText.css';

Jodit.plugins.add('uploadImage', uploadImage);
Jodit.plugins.add('preparePaste', preparePaste);
// @ts-ignore
Jodit.defaultOptions.toolbarAdaptive = false;

const RichText: React.FC<RichTextProps> = ({ richTextContent, setRichTextContent, removeRichTextContent }) => {
  const editor = useRef<null | Jodit>(null);
  const { title, content } = richTextContent;

  const handleEditorChange = (newContent: string) => {
    setRichTextContent({ ...richTextContent, content: newContent, });
  };

  const handleTitleChange = (newTitle: string) => {
    setRichTextContent({ ...richTextContent, title: newTitle, });
  };

  Jodit.plugins.add('save', (jodit: IJodit) => save(jodit, handleEditorChange));

  return (
    <Flex direction={"column"} w={"full"}>
      <Flex>
        <Input defaultValue={title} onChange={(e) => handleTitleChange(e.target.value)} />
        <Button onClick={() => removeRichTextContent()}>
          <Icon as={MdDelete} />
        </Button>
      </Flex>
      <JoditEditor
        ref={editor}
        value={content}
        config={{
          buttons: ['bold', 'italic', 'underline', 'image'],
          // @ts-ignore
        }}
      />
    </Flex>
  );
};

export default RichText;