<?php 

namespace App\Core;

class Email {

    protected $subject = '';
    protected $body = '';
    protected $isHtml = false;

    public function setBody( $body )
    {
        $this->body = $body;
    }

    public function setHTML( $html )
    {
        $this->setBody( $html );
        $this->isHtml = true;
    }

    public function setSubject( $subject )
    {
        $this->subject = $subject;
    }

    public function send( $email )
    {
        $headers = 'From: crypto@louisjimenezp.com' . "\r\n" .
            'Reply-To: crypto@louisjimenezp.com' . "\r\n" .
            'X-Mailer: PHP/' . phpversion() . "\r\n";
        if ( $this->isHtml )
        {
            $headers.= 'MIME-Version: 1.0' . "\r\n" .
                'Content-type: text/html; charset=utf-8' . "\r\n";
        }
        mail($email, $this->subject, $this->body, $headers);
    }

    public function html2text( $html )
    {
        $text = strip_tags( $html , '<br>');
        $text = preg_replace('/\<br(\s*)?\/?\>/i', PHP_EOL, $text);
        return $text;
    }
}
